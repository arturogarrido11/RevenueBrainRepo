"use node"

import { internalAction } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"

export const sendSms = internalAction({
  args: {
    to: v.string(),
    twilioCallSid: v.string(),
    callTimestamp: v.number(),
  },
  handler: async (ctx, { to, twilioCallSid, callTimestamp }) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_PHONE_NUMBER

    console.log("[sendSms] Starting. to:", to, "from:", from, "sid:", twilioCallSid)

    if (!accountSid || !authToken || !from) {
      console.error("[sendSms] Missing Twilio env vars")
      return
    }

    const settings = await ctx.runQuery(internal.settings.getInternal)

    const body = settings.smsTemplate
      .replace("{business_name}", settings.businessName)
      .replace("{caller_name}", "there")
      .replace("{callback_url}", "")

    console.log("[sendSms] Sending SMS body:", body)

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64")

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
      }
    )

    const responseTime = Math.round((Date.now() - callTimestamp) / 1000)
    const responseText = await response.text()

    console.log("[sendSms] Twilio response status:", response.status, "body:", responseText)

    if (response.ok) {
      console.log("[sendSms] SMS sent successfully")
      await ctx.runMutation(internal.calls.markSmsResponse, {
        twilioCallSid,
        smsBody: body,
        responseTime,
      })
      await ctx.runMutation(internal.contacts.upsertByPhone, {
        phoneNumber: to,
        responseChannel: "sms",
      })
    } else {
      console.error("[sendSms] Twilio SMS failed. Status:", response.status, "Error:", responseText)
    }
  },
})
