/**
 * Session manager — handles one Twilio ↔ OpenAI Realtime call session.
 *
 * Lifecycle:
 *   1. Twilio WebSocket connects with callSid, from, to query params
 *   2. Bridge opens OpenAI Realtime WebSocket + sends session.update
 *   3. Audio forwarding loop (Twilio μ-law 8kHz ↔ OpenAI PCM 16kHz)
 *   4. Tool calls handled mid-conversation
 *   5. On session end: POST summary to Convex /voice/session-end
 */

import WebSocket from "ws"
import { mulawToPcm16, pcm16ToMulaw } from "./audio.js"
import { buildSystemPrompt } from "./system-prompt.js"
import { TOOL_DEFINITIONS, dispatchTool } from "./tools/index.js"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ReceptionistConfig {
  personaName: string
  personaInstructions?: string
  greetingMessage?: string
  faqs?: Array<{ question: string; answer: string }>
  schedulingMode: "capture_only" | "live_book"
  calendarProvider?: string | null
  calendarApiKey?: string | null
  calendarEventTypeId?: string | null
  businessHoursTimezone?: string
  escalationNumber?: string
  enabled: boolean
}

export interface SessionState {
  callSid: string
  fromNumber: string
  toNumber: string
  startedAt: number

  // Config (fetched from Convex at session start)
  config?: ReceptionistConfig

  // Collected during session
  capturedLead?: {
    callerName?: string
    callerPhone?: string
    callerEmail?: string
    intent: string
    priority?: "hot" | "warm" | "low"
  }
  pendingAppointment?: {
    callerName?: string
    callerEmail?: string
    callerNotes?: string
    requestedDatetime?: string
    requestedDatetimeRaw?: string
    bookingStatus: "captured" | "booked" | "failed" | "transferred"
    calendarProvider?: "calendly" | "cal_com" | "google_calendar"
    calendarBookingId?: string
    calendarBookingUrl?: string
    calendarStartTime?: string
    calendarEndTime?: string
  }
  callOutcome?: "answered_ai" | "transferred" | "voicemail_captured" | "appointment_scheduled" | "abandoned"
  endCallSummary?: string
  transcript?: string

  // Control flags
  shouldClose?: boolean
}

// OpenAI Realtime API WebSocket URL
const OPENAI_WS_URL = `wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1`

// ─────────────────────────────────────────────────────────────────────────────
// Fetch config from Convex
// ─────────────────────────────────────────────────────────────────────────────

async function fetchConfigFromConvex(): Promise<ReceptionistConfig | null> {
  const convexSiteUrl = process.env.CONVEX_SITE_URL
  if (!convexSiteUrl) return null

  try {
    // We call the Convex HTTP action that returns the config
    // Note: receptionist_config.get is a public query, accessible via the Convex client
    // For the bridge, we read config at session start via a dedicated endpoint
    // For now, fall back to env-based defaults since the bridge has no Convex client
    // The config is loaded by the /voice HTTP action and should be passed via
    // the WebSocket URL's query params or a dedicated config endpoint.
    // This is a simplified implementation — in production, pass config via query params
    // or a pre-flight HTTP request.
    return null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Send session summary to Convex
// ─────────────────────────────────────────────────────────────────────────────

async function postSessionEnd(state: SessionState): Promise<void> {
  const convexSiteUrl = process.env.CONVEX_SITE_URL
  const bridgeSecret = process.env.BRIDGE_SECRET

  if (!convexSiteUrl || !bridgeSecret) {
    console.warn(JSON.stringify({
      event: "session.session_end.skipped",
      reason: "missing_env",
      callSid: state.callSid,
    }))
    return
  }

  const durationSec = Math.round((Date.now() - state.startedAt) / 1000)

  const payload: Record<string, unknown> = {
    twilioCallSid: state.callSid,
    callOutcome: state.callOutcome ?? "abandoned",
    callDurationSec: durationSec,
  }

  if (state.endCallSummary) payload.summary = state.endCallSummary
  if (state.transcript) payload.transcript = state.transcript
  if (state.capturedLead?.priority) payload.priority = state.capturedLead.priority
  if (state.pendingAppointment) payload.appointment = state.pendingAppointment

  try {
    const res = await fetch(`${convexSiteUrl}/voice/session-end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bridge-secret": bridgeSecret,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(JSON.stringify({
        event: "session.session_end.failed",
        callSid: state.callSid,
        status: res.status,
        body: text,
      }))
    } else {
      console.log(JSON.stringify({
        event: "session.session_end.ok",
        callSid: state.callSid,
        callOutcome: state.callOutcome,
        durationSec,
      }))
    }
  } catch (err) {
    console.error(JSON.stringify({
      event: "session.session_end.exception",
      callSid: state.callSid,
      error: String(err),
    }))
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main session handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleSession(
  twilioWs: WebSocket,
  callSid: string,
  fromNumber: string,
  toNumber: string,
  configOverride?: Partial<ReceptionistConfig>
): Promise<void> {
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    console.error(JSON.stringify({ event: "session.start.missing_openai_key" }))
    twilioWs.close()
    return
  }

  const state: SessionState = {
    callSid,
    fromNumber,
    toNumber,
    startedAt: Date.now(),
  }

  // Build config (in production, fetch from Convex; for now use defaults + override)
  const defaultConfig: ReceptionistConfig = {
    personaName: "Alex",
    schedulingMode: "capture_only",
    enabled: true,
    businessHoursTimezone: "America/New_York",
  }
  state.config = { ...defaultConfig, ...configOverride }

  const businessName = process.env.BUSINESS_NAME ?? "the business"
  const systemPrompt = buildSystemPrompt(state.config, businessName)

  console.log(JSON.stringify({
    event: "session.start",
    callSid,
    fromNumber,
    schedulingMode: state.config.schedulingMode,
    calendarProvider: state.config.calendarProvider,
  }))

  // Open OpenAI Realtime WebSocket
  const openaiWs = new WebSocket(OPENAI_WS_URL, {
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "OpenAI-Beta": "realtime=v1",
    },
  })

  let streamSid = ""

  // Pending function call accumulator (for streaming args)
  const pendingCalls = new Map<string, { callId: string; name: string; args: string }>()

  // Max call duration enforcer
  const maxDurationMs = (parseInt(process.env.MAX_CALL_DURATION_SEC ?? "300", 10)) * 1000
  const maxDurationTimer = setTimeout(() => {
    console.log(JSON.stringify({ event: "session.max_duration_reached", callSid }))
    state.callOutcome ??= "answered_ai"
    openaiWs.close()
    twilioWs.close()
  }, maxDurationMs)

  // ── OpenAI WebSocket events ──────────────────────────────────────────────

  openaiWs.on("open", () => {
    console.log(JSON.stringify({ event: "openai.connected", callSid }))

    // Configure the Realtime session
    openaiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        voice: "shimmer",
        instructions: systemPrompt,
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        turn_detection: { type: "semantic_vad" },
        tools: TOOL_DEFINITIONS,
        tool_choice: "auto",
        temperature: 0.8,
      },
    }))

    // Trigger the initial greeting
    openaiWs.send(JSON.stringify({
      type: "response.create",
      response: {
        modalities: ["audio"],
        instructions: "Greet the caller with your opening greeting now.",
      },
    }))
  })

  openaiWs.on("message", async (raw) => {
    let msg: Record<string, unknown>
    try {
      msg = JSON.parse(raw.toString())
    } catch {
      return
    }

    const eventType = msg.type as string

    // ── Audio output → encode and forward to Twilio ──────────────────────
    if (eventType === "response.audio.delta") {
      const delta = msg.delta as string | undefined
      if (!delta || !streamSid) return

      try {
        const pcm16Buf = Buffer.from(delta, "base64")
        const mulawBuf = pcm16ToMulaw(pcm16Buf)
        const payload = mulawBuf.toString("base64")

        const mediaMsg = JSON.stringify({
          event: "media",
          streamSid,
          media: { payload },
        })
        if (twilioWs.readyState === WebSocket.OPEN) {
          twilioWs.send(mediaMsg)
        }
      } catch (err) {
        console.error(JSON.stringify({ event: "audio.encode_error", callSid, error: String(err) }))
      }
      return
    }

    // ── Function call (streaming args) ────────────────────────────────────
    if (eventType === "response.function_call_arguments.delta") {
      const itemId = msg.item_id as string
      const callId = msg.call_id as string
      const name = msg.name as string
      const delta = msg.delta as string

      if (!pendingCalls.has(itemId)) {
        pendingCalls.set(itemId, { callId, name, args: "" })
      }
      const pc = pendingCalls.get(itemId)!
      pc.args += delta
      return
    }

    // ── Function call complete ─────────────────────────────────────────────
    if (eventType === "response.function_call_arguments.done") {
      const itemId = msg.item_id as string
      const callId = msg.call_id as string
      const name = msg.name as string
      const argumentsStr = msg.arguments as string

      const accumulated = pendingCalls.get(itemId)
      const finalArgs = argumentsStr || accumulated?.args || "{}"
      pendingCalls.delete(itemId)

      console.log(JSON.stringify({
        event: "openai.tool_call",
        callSid,
        name,
        callId,
      }))

      // Execute tool
      const toolResult = await dispatchTool(name, finalArgs, state)

      // Send function output back to OpenAI
      openaiWs.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: toolResult,
        },
      }))

      // Resume response generation
      openaiWs.send(JSON.stringify({ type: "response.create" }))

      // If end_call or transfer_call triggered close, handle it
      if (state.shouldClose) {
        setTimeout(() => {
          openaiWs.close()
        }, 2000) // give AI 2s to say goodbye
      }
      return
    }

    // ── Transcript (for logging) ──────────────────────────────────────────
    if (eventType === "response.audio_transcript.done") {
      const transcript = msg.transcript as string
      if (transcript) {
        state.transcript = (state.transcript ? state.transcript + "\n" : "") + `AI: ${transcript}`
      }
      return
    }

    if (eventType === "conversation.item.input_audio_transcription.completed") {
      const transcript = msg.transcript as string
      if (transcript) {
        state.transcript = (state.transcript ? state.transcript + "\n" : "") + `Caller: ${transcript}`
      }
      return
    }

    // ── Input audio transcription config ─────────────────────────────────
    if (eventType === "session.created") {
      // Enable input transcription after session is ready
      openaiWs.send(JSON.stringify({
        type: "session.update",
        session: {
          input_audio_transcription: { model: "whisper-1" },
        },
      }))
      return
    }

    // ── Error handling ────────────────────────────────────────────────────
    if (eventType === "error") {
      console.error(JSON.stringify({
        event: "openai.error",
        callSid,
        error: msg.error,
      }))
    }
  })

  openaiWs.on("close", async () => {
    console.log(JSON.stringify({ event: "openai.closed", callSid }))
    clearTimeout(maxDurationTimer)
    await postSessionEnd(state)
    if (twilioWs.readyState === WebSocket.OPEN) {
      twilioWs.close()
    }
  })

  openaiWs.on("error", (err) => {
    console.error(JSON.stringify({ event: "openai.ws_error", callSid, error: err.message }))
  })

  // ── Twilio WebSocket events ──────────────────────────────────────────────

  twilioWs.on("message", (raw) => {
    let msg: Record<string, unknown>
    try {
      msg = JSON.parse(raw.toString())
    } catch {
      return
    }

    const event = msg.event as string

    if (event === "start") {
      const startData = msg.start as { streamSid?: string; callSid?: string } | undefined
      streamSid = startData?.streamSid ?? ""
      console.log(JSON.stringify({ event: "twilio.stream_start", callSid, streamSid }))
      return
    }

    if (event === "media") {
      const media = msg.media as { payload?: string } | undefined
      const payload = media?.payload
      if (!payload || openaiWs.readyState !== WebSocket.OPEN) return

      try {
        const mulawBuf = Buffer.from(payload, "base64")
        const pcm16Buf = mulawToPcm16(mulawBuf)
        const pcm16B64 = pcm16Buf.toString("base64")

        openaiWs.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: pcm16B64,
        }))
      } catch (err) {
        console.error(JSON.stringify({ event: "audio.decode_error", callSid, error: String(err) }))
      }
      return
    }

    if (event === "stop") {
      console.log(JSON.stringify({ event: "twilio.stream_stop", callSid }))
      state.callOutcome ??= "abandoned"
      openaiWs.close()
      return
    }
  })

  twilioWs.on("close", () => {
    console.log(JSON.stringify({ event: "twilio.ws_closed", callSid }))
    state.callOutcome ??= "abandoned"
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close()
    }
  })

  twilioWs.on("error", (err) => {
    console.error(JSON.stringify({ event: "twilio.ws_error", callSid, error: err.message }))
  })
}
