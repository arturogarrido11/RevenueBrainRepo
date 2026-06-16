import { query, mutation, internalMutation, internalQuery, internalAction } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// --- Cloudflare R2 client (S3-compatible) ---
const r2Bucket = process.env.R2_BUCKET
const r2Endpoint = process.env.R2_ENDPOINT
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY

const r2Enabled = !!r2Bucket && !!r2Endpoint && !!r2AccessKeyId && !!r2SecretAccessKey

const r2Client = r2Enabled
  ? new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId!,
        secretAccessKey: r2SecretAccessKey!,
      },
      forcePathStyle: true,
    })
  : null

async function maybeUploadRecordingToR2(
  twilioCallSid: string,
  phoneNumber: string | undefined,
  audioBuffer: ArrayBuffer
): Promise<{ bucket: string; key: string } | null> {
  if (!r2Enabled || !r2Client || !r2Bucket) {
    console.warn(
      JSON.stringify({
        event: "ai_receptionist.r2_upload_skipped",
        reason: "missing_r2_env",
        twilioCallSid,
      })
    )
    return null
  }

  const sanitizedPhone = phoneNumber?.replace(/^\+/, "") ?? "unknown"
  const key = `calls/${sanitizedPhone}/${twilioCallSid}.mp3`

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: new Uint8Array(audioBuffer),
        ContentType: "audio/mpeg",
      })
    )

    console.log(
      JSON.stringify({
        event: "ai_receptionist.r2_upload_success",
        twilioCallSid,
        bucket: r2Bucket,
        key,
      })
    )

    return { bucket: r2Bucket, key }
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "ai_receptionist.r2_upload_failed",
        twilioCallSid,
        error: String(err),
      })
    )
    return null
  }
}

export const listRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_timestamp")
      .order("desc")
      .take(8)
  },
})

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_timestamp")
      .order("desc")
      .collect()
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const calls = await ctx.db.query("calls").collect()
    const contacts = await ctx.db.query("contacts").collect()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayMs = todayStart.getTime()

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const yesterdayMs = yesterdayStart.getTime()

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const todayCalls = calls.filter((c) => c.timestamp >= todayMs)
    const yesterdayCalls = calls.filter(
      (c) => c.timestamp >= yesterdayMs && c.timestamp < todayMs
    )
    const respondedCalls = calls.filter((c) => c.status === "responded")
    const responseTimes = calls
      .filter((c) => c.responseTime != null)
      .map((c) => c.responseTime as number)

    return {
      missedToday: todayCalls.length,
      missedYesterday: yesterdayCalls.length,
      responseRate:
        calls.length > 0 ? respondedCalls.length / calls.length : 0,
      avgResponseTimeSeconds:
        responseTimes.length > 0
          ? Math.round(
              responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            )
          : 0,
      totalContacts: contacts.length,
      newContactsThisWeek: contacts.filter((c) => c.lastCalledAt >= weekAgo)
        .length,
    }
  },
})

export const getByCallSid = internalQuery({
  args: { twilioCallSid: v.string() },
  handler: async (ctx, { twilioCallSid }) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", twilioCallSid))
      .first()
  },
})

export const createOrMarkMissed = internalMutation({
  args: {
    twilioCallSid: v.string(),
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", args.twilioCallSid))
      .first()

    if (existing) {
      // Only send SMS if it hasn't been sent yet and status is being set to missed
      if (!existing.smsSent) {
        await ctx.db.patch(existing._id, {
          phoneNumber: args.phoneNumber,
          callerName: args.callerName ?? existing.callerName,
          status: "missed",
          timestamp: existing.timestamp ?? args.timestamp,
        })
        await ctx.scheduler.runAfter(0, internal.twilio.sendSms, {
          to: args.phoneNumber,
          twilioCallSid: args.twilioCallSid,
          callTimestamp: args.timestamp,
        })
      } else {
        await ctx.db.patch(existing._id, {
          phoneNumber: args.phoneNumber,
          callerName: args.callerName ?? existing.callerName,
          status: "missed",
          timestamp: existing.timestamp ?? args.timestamp,
        })
      }
      return existing._id
    }

    const id = await ctx.db.insert("calls", {
      twilioCallSid: args.twilioCallSid,
      phoneNumber: args.phoneNumber,
      callerName: args.callerName,
      timestamp: args.timestamp,
      status: "missed",
      responseChannel: "none",
      smsSent: false,
    })

    await ctx.scheduler.runAfter(0, internal.twilio.sendSms, {
      to: args.phoneNumber,
      twilioCallSid: args.twilioCallSid,
      callTimestamp: args.timestamp,
    })

    return id
  },
})

export const markSmsSent = internalMutation({
  args: {
    twilioCallSid: v.string(),
    smsBody: v.string(),
  },
  handler: async (ctx, { twilioCallSid, smsBody }) => {
    const call = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", twilioCallSid))
      .first()

    if (!call) return

    await ctx.db.patch(call._id, {
      smsSent: true,
      smsBody,
    })
  },
})

export const upsertAiReceptionistRecording = internalMutation({
  args: {
    twilioCallSid: v.string(),
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),
    timestamp: v.number(),
    recordingUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", args.twilioCallSid))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        phoneNumber: args.phoneNumber,
        callerName: args.callerName ?? existing.callerName,
        timestamp: existing.timestamp ?? args.timestamp,
        status: "ai_recorded",
        type: "ai_receptionist",
        channel: "voice",
        recordingUrl: args.recordingUrl,
      })
      return existing._id
    }

    return await ctx.db.insert("calls", {
      twilioCallSid: args.twilioCallSid,
      phoneNumber: args.phoneNumber,
      callerName: args.callerName,
      timestamp: args.timestamp,
      status: "ai_recorded",
      responseChannel: "none",
      responseTime: undefined,
      smsSent: false,
      smsBody: undefined,
      type: "ai_receptionist",
      channel: "voice",
      recordingUrl: args.recordingUrl,
    })
  },
})

export const processAiRecording = internalAction({
  args: {
    twilioCallSid: v.string(),
  },
  handler: async (ctx, { twilioCallSid }) => {
    const call = await ctx.runQuery(internal.calls.getByCallSid, { twilioCallSid })

    if (!call || !call.recordingUrl) {
      console.warn(
        JSON.stringify({
          event: "ai_receptionist.process_skipped",
          reason: "no_call_or_recording",
          twilioCallSid,
        })
      )
      return
    }

    console.log(
      JSON.stringify({
        event: "ai_receptionist.process_start",
        twilioCallSid,
        recordingUrl: call.recordingUrl,
      })
    )

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.warn(
        JSON.stringify({
          event: "ai_receptionist.process_skipped",
          reason: "missing_openai_api_key",
          twilioCallSid,
        })
      )
      return
    }

    const recordingUrl = call.recordingUrl.endsWith(".mp3")
      ? call.recordingUrl
      : `${call.recordingUrl}.mp3`

    const audioRes = await fetch(recordingUrl)
    if (!audioRes.ok) {
      console.error(
        JSON.stringify({
          event: "ai_receptionist.recording_download_failed",
          twilioCallSid,
          status: audioRes.status,
        })
      )
      return
    }

    const audioBuffer = await audioRes.arrayBuffer()

    await maybeUploadRecordingToR2(twilioCallSid, call.phoneNumber, audioBuffer)

    const transcriptionForm = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
    transcriptionForm.append("file", audioBlob, "call.mp3")
    transcriptionForm.append("model", "whisper-1")

    const transcriptionRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: transcriptionForm,
    })

    if (!transcriptionRes.ok) {
      const errorText = await transcriptionRes.text()
      console.error(
        JSON.stringify({
          event: "ai_receptionist.transcription_failed",
          twilioCallSid,
          status: transcriptionRes.status,
          error: errorText,
        })
      )
      return
    }

    const transcriptionJson: any = await transcriptionRes.json()
    const transcript: string = transcriptionJson.text ?? ""

    const summaryRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that summarizes inbound phone calls for small businesses and scores lead priority.",
          },
          {
            role: "user",
            content:
              `Caller transcript: "${transcript}".\n\nReturn concise JSON only with fields: summary (string, 1-2 sentences), priority (one of: hot, warm, low).`,
          },
        ],
        temperature: 0.2,
      }),
    })

    if (!summaryRes.ok) {
      const errorText = await summaryRes.text()
      console.error(
        JSON.stringify({
          event: "ai_receptionist.summary_failed",
          twilioCallSid,
          status: summaryRes.status,
          error: errorText,
        })
      )
      return
    }

    const summaryJson: any = await summaryRes.json()
    const rawContent: string =
      summaryJson.choices?.[0]?.message?.content ?? "{\"summary\": \"\", \"priority\": \"low\"}"

    let parsed: { summary: string; priority: "hot" | "warm" | "low" }
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      parsed = { summary: rawContent.slice(0, 280), priority: "low" }
    }

    const priority: "hot" | "warm" | "low" =
      parsed.priority === "hot" || parsed.priority === "warm" || parsed.priority === "low"
        ? parsed.priority
        : "low"

    await ctx.runMutation(internal.calls.updateFromAiProcessing, {
      twilioCallSid,
      transcript,
      summary: parsed.summary,
      priority,
    })

    const settings = await ctx.runQuery(internal.settings.getInternal)

    const resendApiKey = process.env.RESEND_API_KEY
    if (settings.ownerAlertEmailEnabled && settings.ownerEmail && resendApiKey) {
      try {
        const emailBody = `New lead from Revenue Brain.\n\nFrom: ${
          call.phoneNumber
        }\nPriority: ${priority.toUpperCase()}\n\nSummary:\n${parsed.summary}\n\nTranscript:\n${transcript}`

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Revenue Brain <no-reply@revenuebrain.ai>",
            to: settings.ownerEmail,
            subject: "New lead from Revenue Brain",
            text: emailBody,
          }),
        })

        if (!emailRes.ok) {
          const text = await emailRes.text()
          console.error(
            JSON.stringify({
              event: "ai_receptionist.email_failed",
              twilioCallSid,
              status: emailRes.status,
              error: text,
            })
          )
        }
      } catch (err) {
        console.error(
          JSON.stringify({
            event: "ai_receptionist.email_exception",
            twilioCallSid,
            error: String(err),
          })
        )
      }
    }

    console.log(
      JSON.stringify({
        event: "ai_receptionist.process_complete",
        twilioCallSid,
        priority,
      })
    )
  },
})

export const recordInboundSmsLead = internalMutation({
  args: {
    fromPhoneNumber: v.string(),
    messageBody: v.string(),
    timestamp: v.number(),
    businessId: v.optional(v.string()),
    twilioMessageSid: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { fromPhoneNumber, messageBody, timestamp, businessId, twilioMessageSid }
  ) => {
    await ctx.db.insert("leads", {
      fromPhoneNumber,
      messageBody,
      timestamp,
      businessId,
      twilioMessageSid,
    })

    const latestCall = await ctx.db
      .query("calls")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", fromPhoneNumber))
      .order("desc")
      .first()

    if (latestCall) {
      const responseTime = Math.max(
        0,
        Math.round((timestamp - latestCall.timestamp) / 1000)
      )

      await ctx.db.patch(latestCall._id, {
        status: "responded",
        responseChannel: "sms",
        responseTime,
      })
    }
  },
})

export const updateFromAiProcessing = internalMutation({
  args: {
    twilioCallSid: v.string(),
    transcript: v.string(),
    summary: v.string(),
    priority: v.union(v.literal("hot"), v.literal("warm"), v.literal("low")),
  },
  handler: async (ctx, { twilioCallSid, transcript, summary, priority }) => {
    const call = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", twilioCallSid))
      .first()

    if (!call) return

    await ctx.db.patch(call._id, {
      transcript,
      summary,
      priority,
    })
  },
})

export const listFiltered = query({
  args: {
    status: v.optional(v.union(
      v.literal("missed"),
      v.literal("responded"),
      v.literal("pending"),
      v.literal("ai_recorded"),
    )),
    search: v.optional(v.string()),
    dateRange: v.optional(v.union(
      v.literal("today"),
      v.literal("7d"),
      v.literal("30d"),
      v.literal("month")
    )),
  },
  handler: async (ctx, { status, search, dateRange }) => {
    let calls = await ctx.db.query("calls").withIndex("by_timestamp").order("desc").collect()
    if (status) calls = calls.filter((c) => c.status === status)
    if (dateRange) {
      const now = Date.now()
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const cutoffs: Record<string, number> = {
        today: todayStart.getTime(),
        "7d": now - 7 * 24 * 60 * 60 * 1000,
        "30d": now - 30 * 24 * 60 * 60 * 1000,
        month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
      }
      const cutoff = cutoffs[dateRange]
      if (cutoff) calls = calls.filter((c) => c.timestamp >= cutoff)
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      calls = calls.filter((c) => c.phoneNumber.toLowerCase().includes(q) || (c.callerName ?? "").toLowerCase().includes(q))
    }
    return calls
  },
})

export const markHandled = mutation({
  args: { callId: v.id("calls") },
  handler: async (ctx, { callId }) => {
    await ctx.db.patch(callId, { status: "responded" })
  },
})

export const getCallsByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, { phoneNumber }) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", phoneNumber))
      .order("desc")
      .collect()
  },
})

export const toggleHandled = mutation({
  args: { callId: v.id("calls") },
  handler: async (ctx, { callId }) => {
    const call = await ctx.db.get(callId)
    if (!call) return
    const newStatus = call.status === "responded" ? "missed" : "responded"
    await ctx.db.patch(callId, { status: newStatus })
  },
})
