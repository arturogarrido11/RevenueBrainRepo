import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const http = httpRouter()

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed"])
const STOP_KEYWORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"])

async function computeTwilioSignature(url: string, body: string, authToken: string) {
  const params = new URLSearchParams(body)
  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  let data = url
  for (const [key, value] of sorted) {
    data += key + value
  }

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data))

  const bytes = new Uint8Array(signature)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

async function validateTwilioRequest(request: Request, body: string) {
  const expected = request.headers.get("x-twilio-signature")
  const token = process.env.TWILIO_WEBHOOK_SECRET || process.env.TWILIO_AUTH_TOKEN

  if (!token) return { ok: true, skipped: true }
  if (!expected) return { ok: false, reason: "missing_signature_header" }

  const computed = await computeTwilioSignature(request.url, body, token)
  return {
    ok: computed === expected,
    skipped: false,
    reason: computed === expected ? undefined : "invalid_signature",
  }
}

// Voice status callback endpoint.
// Configure in Twilio Number > Voice > "Status callback URL".
http.route({
  path: "/voice/status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()

    const validation = await validateTwilioRequest(request, body)
    if (!validation.ok) {
      console.warn(
        JSON.stringify({ event: "webhook.voice_status.rejected", reason: validation.reason })
      )
      return new Response("Invalid signature", { status: 403 })
    }

    const params = new URLSearchParams(body)
    const callSid = params.get("CallSid") ?? ""
    const from = params.get("From") ?? ""
    const callerName = params.get("CallerName") || undefined
    const callStatus = (params.get("CallStatus") ?? "").toLowerCase()
    const timestamp = Date.now()

    console.log(
      JSON.stringify({
        event: "webhook.voice_status.received",
        callSid,
        from,
        callerName,
        callStatus,
      })
    )

    if (!callSid || !from || !MISSED_STATUSES.has(callStatus)) {
      return new Response("Ignored", { status: 200 })
    }

    await ctx.runMutation(internal.calls.createOrMarkMissed, {
      twilioCallSid: callSid,
      phoneNumber: from,
      callerName,
      timestamp,
    })

    await ctx.runMutation(internal.contacts.upsertByPhone, {
      phoneNumber: from,
      callerName,
    })

    const settings = await ctx.runQuery(internal.settings.getInternal)
    if (settings.smsEnabled) {
      await ctx.scheduler.runAfter(
        Math.max(0, settings.responseDelaySeconds * 1000),
        internal.twilio.sendSms,
        {
          to: from,
          twilioCallSid: callSid,
          callTimestamp: timestamp,
        }
      )
    }

    return new Response("OK", { status: 200 })
  }),
})

// Inbound SMS webhook endpoint.
// Configure in Twilio Number > Messaging > "A message comes in".
http.route({
  path: "/sms",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()

    const validation = await validateTwilioRequest(request, body)
    if (!validation.ok) {
      console.warn(
        JSON.stringify({ event: "webhook.sms.rejected", reason: validation.reason })
      )
      return new Response("Invalid signature", { status: 403 })
    }

    const params = new URLSearchParams(body)
    const from = params.get("From") ?? ""
    const messageBody = params.get("Body") ?? ""
    const messageSid = params.get("MessageSid") || undefined
    const businessId = params.get("To") || undefined
    const timestamp = Date.now()

    console.log(
      JSON.stringify({
        event: "webhook.sms.received",
        from,
        messageSid,
        businessId,
      })
    )

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

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { "Content-Type": "text/xml" }, status: 200 }
    )
  }),
})

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "ok", service: "revenue-brain-webhooks", at: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  }),
})

export default http
