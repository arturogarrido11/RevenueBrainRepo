import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const http = httpRouter()

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed"])
const STOP_KEYWORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"])

// Voice status callback endpoint.
// Configure in Twilio Number > Voice > "Status callback URL".
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
      const computed = await ctx.runAction(internal.twilioSignature.computeSignature, {
        url: request.url,
        body,
        authToken: token,
      })

      if (computed !== expected) {
        console.warn(JSON.stringify({
          event: "webhook.twilio_signature_mismatch",
          url: request.url,
          providedSignature: expected,
          computedSignature: computed,
          method: request.method,
        }))
        return new Response("Invalid signature", { status: 403 })
      }
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

    await ctx.runMutation(internal.calls.createOrMarkMissed, {
      twilioCallSid: callSid,
      phoneNumber: from,
      callerName,
      timestamp,
    })

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
      const computed = await ctx.runAction(internal.twilioSignature.computeSignature, {
        url: request.url,
        body,
        authToken: token,
      })

      if (computed !== expected) {
        console.warn(JSON.stringify({
          event: "webhook.twilio_signature_mismatch",
          url: request.url,
          providedSignature: expected,
          computedSignature: computed,
          method: request.method,
        }))
        return new Response("Invalid signature", { status: 403 })
      }
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
