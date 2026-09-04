import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { v4 as uuidv4 } from "uuid"

const http = httpRouter()

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed"])
const STOP_KEYWORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"])

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function twiml(xml: string) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>${xml}`,
    { headers: { "Content-Type": "text/xml" }, status: 200 }
  )
}

/** Returns the UTC hour (0–23) in the given IANA timezone. */
function getHourInTimezone(date: Date, tz: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: tz,
    })
    return parseInt(formatter.format(date), 10)
  } catch {
    return date.getUTCHours()
  }
}

/** Returns the day of week (0=Sun, 1=Mon…6=Sat) in the given IANA timezone. */
function getDayInTimezone(date: Date, tz: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: tz,
    })
    const day = formatter.format(date)
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day)
  } catch {
    return date.getUTCDay()
  }
}

function parseHour(hhmm: string): number {
  return parseInt(hhmm.split(":")[0], 10)
}

function buildStreamTwiml(bridgeWssUrl: string): string {
  return `<Response><Connect><Stream url="${bridgeWssUrl}" /></Connect></Response>`
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /voice — Main Twilio Voice Webhook
// Configure this as the Twilio number's Voice Webhook URL.
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/voice",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const callSid = params.get("CallSid") ?? ""
    const from = params.get("From") ?? ""
    const callerName = params.get("CallerName") || undefined
    const timestamp = Date.now()

    const bridgeWssUrl = process.env.BRIDGE_WSS_URL
    const convexSiteUrl = process.env.CONVEX_SITE_URL ?? ""

    if (!bridgeWssUrl) {
      console.error(JSON.stringify({
        event: "webhook.voice.missing_bridge_url",
        callSid,
      }))
      return twiml("<Response><Say>We're sorry, we are unable to take your call right now. Please try again later.</Say></Response>")
    }

    const config = await ctx.runQuery(internal.receptionist_config.getInternal)

    if (!config.enabled) {
      // AI receptionist disabled — fall through to standard Twilio behavior
      return twiml("<Response></Response>")
    }

    // Create the call record (or update if it already exists from a status callback)
    if (callSid && from) {
      await ctx.runMutation(internal.calls.createAiSession, {
        twilioCallSid: callSid,
        phoneNumber: from,
        callerName,
        timestamp,
      })
    }

    const { triggerMode } = config

    // ── Mode: always_on ──────────────────────────────────────────────────────
    if (triggerMode === "always_on") {
      return twiml(buildStreamTwiml(bridgeWssUrl))
    }

    // ── Mode: after_hours ────────────────────────────────────────────────────
    if (triggerMode === "after_hours") {
      const tz = config.businessHoursTimezone ?? "America/New_York"
      const now = new Date()
      const localHour = getHourInTimezone(now, tz)
      const localDay = getDayInTimezone(now, tz)
      const businessDays = config.businessDays ?? [1, 2, 3, 4, 5]
      const startHour = parseHour(config.businessHoursStart ?? "09:00")
      const endHour = parseHour(config.businessHoursEnd ?? "17:00")
      const isDuringBusinessHours =
        businessDays.includes(localDay) &&
        localHour >= startHour &&
        localHour < endHour

      if (isDuringBusinessHours && config.forwardToNumber) {
        // During business hours → forward to real number, no AI
        return twiml(
          `<Response><Dial timeout="${config.forwardRingTimeoutSec ?? 25}" callerId="${from}">${config.forwardToNumber}</Dial></Response>`
        )
      }
      // After hours (or no forward number configured) → AI answers
      return twiml(buildStreamTwiml(bridgeWssUrl))
    }

    // ── Mode: missed_only ────────────────────────────────────────────────────
    // Ring forwardToNumber first; if no answer, /voice/missed-ai handles it
    const forwardTo = config.forwardToNumber
    const timeout = config.forwardRingTimeoutSec ?? 25
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER ?? ""
    const missedAiUrl = `${convexSiteUrl}/voice/missed-ai`

    if (forwardTo) {
      return twiml(
        `<Response><Dial timeout="${timeout}" action="${missedAiUrl}" method="POST" callerId="${twilioPhone}"><Number>${forwardTo}</Number></Dial></Response>`
      )
    }

    // No forward number configured for missed_only → AI answers directly
    return twiml(buildStreamTwiml(bridgeWssUrl))
  }),
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /voice/missed-ai — Dial action callback for missed_only mode
// Twilio calls this after the <Dial> attempt completes.
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/voice/missed-ai",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const dialStatus = (params.get("DialCallStatus") ?? "").toLowerCase()
    const callSid = params.get("CallSid") ?? ""
    const from = params.get("From") ?? ""

    const bridgeWssUrl = process.env.BRIDGE_WSS_URL

    console.log(JSON.stringify({
      event: "webhook.voice_missed_ai.received",
      callSid,
      from,
      dialStatus,
    }))

    // Human picked up — no AI needed
    if (dialStatus === "answered" || dialStatus === "completed") {
      return twiml("<Response></Response>")
    }

    if (!bridgeWssUrl) {
      return twiml("<Response><Say>Sorry, no one is available right now. Please call back later.</Say></Response>")
    }

    // no-answer / busy / failed → AI takes over
    return twiml(buildStreamTwiml(bridgeWssUrl))
  }),
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /voice/transfer-twiml — Returns TwiML to transfer an active call
// Called by the bridge via Twilio REST API call redirect.
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/voice/transfer-twiml",
  method: "POST",
  handler: httpAction(async (ctx, _request) => {
    const config = await ctx.runQuery(internal.receptionist_config.getInternal)
    const escalationNumber = config.escalationNumber

    if (!escalationNumber) {
      return twiml(
        "<Response><Say>I'm sorry, I was unable to transfer your call. Please call back and we'll get you to the right person.</Say></Response>"
      )
    }

    return twiml(
      `<Response><Say>Please hold while I transfer your call.</Say><Dial>${escalationNumber}</Dial></Response>`
    )
  }),
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /voice/session-end — Bridge webhook; called when a Realtime session ends
// Protected by x-bridge-secret header (shared secret).
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/voice/session-end",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // ── Auth check ───────────────────────────────────────────────────────────
    const incomingSecret = request.headers.get("x-bridge-secret")
    const expectedSecret = process.env.BRIDGE_SECRET

    if (!expectedSecret || !incomingSecret || incomingSecret !== expectedSecret) {
      console.warn(JSON.stringify({
        event: "webhook.session_end.auth_failed",
        hasExpected: !!expectedSecret,
        hasIncoming: !!incomingSecret,
      }))
      return new Response("Unauthorized", { status: 401 })
    }

    // ── Parse body ───────────────────────────────────────────────────────────
    let payload: {
      twilioCallSid: string
      aiSessionId?: string
      transcript?: string
      summary?: string
      priority?: "hot" | "warm" | "low"
      callOutcome?: "answered_ai" | "transferred" | "voicemail_captured" | "appointment_scheduled" | "abandoned"
      callDurationSec?: number
      appointment?: {
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
    }

    try {
      payload = await request.json()
    } catch {
      return new Response("Bad Request", { status: 400 })
    }

    const { twilioCallSid, appointment, ...sessionUpdate } = payload

    if (!twilioCallSid) {
      return new Response("Missing twilioCallSid", { status: 400 })
    }

    console.log(JSON.stringify({
      event: "webhook.session_end.received",
      twilioCallSid,
      callOutcome: sessionUpdate.callOutcome,
      hasAppointment: !!appointment,
    }))

    // ── Find the call record ─────────────────────────────────────────────────
    const call = await ctx.runQuery(internal.calls.getByCallSid, { twilioCallSid })

    // ── Create appointment record if present ─────────────────────────────────
    let appointmentId: string | undefined
    if (appointment && call) {
      const apptId = await ctx.runMutation(internal.appointments.create, {
        callId: call._id,
        phoneNumber: call.phoneNumber,
        callerName: appointment.callerName,
        callerEmail: appointment.callerEmail,
        callerNotes: appointment.callerNotes,
        requestedDatetime: appointment.requestedDatetime,
        requestedDatetimeRaw: appointment.requestedDatetimeRaw,
        bookingStatus: appointment.bookingStatus,
        calendarProvider: appointment.calendarProvider,
        calendarBookingId: appointment.calendarBookingId,
        calendarBookingUrl: appointment.calendarBookingUrl,
        calendarStartTime: appointment.calendarStartTime,
        calendarEndTime: appointment.calendarEndTime,
      })
      appointmentId = apptId
    }

    // ── Update the call record ───────────────────────────────────────────────
    await ctx.runMutation(internal.calls.updateFromRealtimeSession, {
      twilioCallSid,
      aiSessionId: sessionUpdate.aiSessionId,
      transcript: sessionUpdate.transcript,
      summary: sessionUpdate.summary,
      priority: sessionUpdate.priority,
      callOutcome: sessionUpdate.callOutcome,
      callDurationSec: sessionUpdate.callDurationSec,
      appointmentId: appointmentId as any,
    })

    // ── Owner alert email ────────────────────────────────────────────────────
    const settings = await ctx.runQuery(internal.settings.getInternal)
    const resendApiKey = process.env.RESEND_API_KEY

    if (settings.ownerAlertEmailEnabled && settings.ownerEmail && resendApiKey && call) {
      const emailBody = [
        `New AI Voice Receptionist call summary — Revenue Brain`,
        ``,
        `From: ${call.phoneNumber}`,
        `Outcome: ${sessionUpdate.callOutcome ?? "unknown"}`,
        sessionUpdate.priority ? `Priority: ${sessionUpdate.priority.toUpperCase()}` : null,
        ``,
        sessionUpdate.summary ? `Summary:\n${sessionUpdate.summary}` : null,
        appointment ? `\nAppointment:\n  Status: ${appointment.bookingStatus}\n  Time: ${appointment.calendarStartTime ?? appointment.requestedDatetimeRaw ?? "N/A"}` : null,
        sessionUpdate.transcript ? `\nTranscript:\n${sessionUpdate.transcript}` : null,
      ].filter(Boolean).join("\n")

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Revenue Brain <no-reply@revenuebrain.ai>",
            to: settings.ownerEmail,
            subject: `AI call from ${call.phoneNumber} — ${sessionUpdate.callOutcome ?? "completed"}`,
            text: emailBody,
          }),
        })
      } catch (err) {
        console.error(JSON.stringify({
          event: "webhook.session_end.email_failed",
          twilioCallSid,
          error: String(err),
        }))
      }
    }

    return new Response("OK", { status: 200 })
  }),
})

// ─────────────────────────────────────────────────────────────────────────────
// Voice status callback endpoint.
// Configure in Twilio Number > Voice > "Status callback URL".
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/voice/status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()

    const expected = request.headers.get("x-twilio-signature")
    const token = process.env.TWILIO_AUTH_TOKEN

    if (!token || !expected) {
      console.warn(JSON.stringify({
        event: "webhook.voice_status.rejected",
        reason: !token ? "missing_auth_token" : "missing_signature_header",
        url: request.url,
      }))
      return new Response("Invalid signature", { status: 403 })
    }

    const testBypass = request.headers.get("x-revenuebrain-internal-test")
    if (testBypass !== "smoke-webhooks") {
      console.warn(
        JSON.stringify({
          event: "webhook.twilio_signature.skipped_validation",
          reason: "twilioSignature action not configured",
          url: request.url,
        }),
      )
    }

    const params = new URLSearchParams(body)
    const callSid = params.get("CallSid") ?? ""
    const from = params.get("From") ?? ""
    const callerName = params.get("CallerName") || undefined
    const callStatus = (params.get("CallStatus") ?? "").toLowerCase()
    const timestamp = Date.now()

    console.log(JSON.stringify({
      event: "webhook.voice_status.received",
      callSid,
      from,
      callerName,
      callStatus,
    }))

    if (!callSid || !from || !MISSED_STATUSES.has(callStatus)) {
      return new Response("Ignored", { status: 200 })
    }

    // Skip missed-call SMS flow for AI receptionist calls
    // (those are handled by /voice/session-end when the session ends)
    const existingCall = await ctx.runQuery(internal.calls.getByCallSid, { twilioCallSid: callSid })
    if (existingCall?.type === "ai_receptionist") {
      return new Response("Ignored (AI session)", { status: 200 })
    }

    await ctx.runMutation(internal.calls.createOrMarkMissed, {
      twilioCallSid: callSid,
      phoneNumber: from,
      callerName,
      timestamp,
    })

    return new Response("OK", { status: 200 })
  }),
})

// ─────────────────────────────────────────────────────────────────────────────
// Inbound SMS webhook endpoint.
// Configure in Twilio Number > Messaging > "A message comes in".
// ─────────────────────────────────────────────────────────────────────────────
http.route({
  path: "/sms",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()

    const expected = request.headers.get("x-twilio-signature")
    const token = process.env.TWILIO_AUTH_TOKEN

    if (!token || !expected) {
      console.warn(JSON.stringify({
        event: "webhook.sms.rejected",
        reason: !token ? "missing_auth_token" : "missing_signature_header",
      }))
      return new Response("Invalid signature", { status: 403 })
    }

    const testBypass = request.headers.get("x-revenuebrain-internal-test")
    if (testBypass !== "smoke-webhooks") {
      console.warn(
        JSON.stringify({
          event: "webhook.twilio_signature.skipped_validation",
          reason: "twilioSignature action not configured",
          url: request.url,
        }),
      )
    }

    const params = new URLSearchParams(body)
    const from = params.get("From") ?? ""
    const messageBody = params.get("Body") ?? ""
    const messageSid = params.get("MessageSid") || undefined
    const businessId = params.get("To") || undefined
    const timestamp = Date.now()

    console.log(JSON.stringify({
      event: "webhook.sms.received",
      from,
      messageSid,
      businessId,
    }))

    if (!from || !messageBody) {
      return new Response("Ignored", { status: 200 })
    }

    const normalizedBody = messageBody.trim().toUpperCase()
    if (STOP_KEYWORDS.has(normalizedBody)) {
      await ctx.runMutation(internal.contacts.setOptOutByPhone, {
        phoneNumber: from,
        optedOut: true,
      })

      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You are unsubscribed and will no longer receive messages.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" }, status: 200 }
      )
    }

    await ctx.runMutation(internal.calls.recordInboundSmsLead, {
      fromPhoneNumber: from,
      messageBody,
      timestamp,
      businessId,
      twilioMessageSid: messageSid,
    })

    await ctx.runMutation(internal.contacts.upsertByPhone, {
      phoneNumber: from,
      responseChannel: "sms",
    })

    await ctx.runMutation(internal.messages.insert, {
      phoneNumber: from,
      direction: "inbound",
      body: messageBody,
      sentBy: "customer",
    })

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" }, status: 200 }
    )
  }),
})

export default http
