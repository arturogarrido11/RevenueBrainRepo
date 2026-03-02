import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const http = httpRouter()

// Twilio calls this URL when someone calls your Twilio number.
// Set this as the Voice webhook URL in your Twilio phone number config:
//   https://<your-deployment>.convex.site/voice
http.route({
  path: "/voice",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text()
    console.log("[voice] Received webhook body:", body)
    const params = new URLSearchParams(body)

    const callSid = params.get("CallSid") ?? ""
    const from = params.get("From") ?? ""
    const callerName = params.get("CallerName") || undefined
    const timestamp = Date.now()

    console.log("[voice] callSid:", callSid, "from:", from, "callerName:", callerName)

    if (callSid && from) {
      // Save the call record
      console.log("[voice] Saving call record...")
      await ctx.runMutation(internal.calls.create, {
        twilioCallSid: callSid,
        phoneNumber: from,
        callerName,
        timestamp,
      })

      // Create or update the contact
      await ctx.runMutation(internal.contacts.upsertByPhone, {
        phoneNumber: from,
        callerName,
      })

      // Fire-and-forget: send auto-SMS
      console.log("[voice] Scheduling sendSms...")
      await ctx.scheduler.runAfter(0, internal.twilio.sendSms, {
        to: from,
        twilioCallSid: callSid,
        callTimestamp: timestamp,
      })
      console.log("[voice] sendSms scheduled successfully")
    } else {
      console.warn("[voice] Missing callSid or from — skipping. callSid:", callSid, "from:", from)
    }

    // TwiML: play a brief message and hang up
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry we missed your call. We will text you right back!</Say>
</Response>`,
      { headers: { "Content-Type": "text/xml" } }
    )
  }),
})

// Twilio occasionally does a GET to verify the URL is reachable
http.route({
  path: "/voice",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("OK", { status: 200 })
  }),
})

export default http
