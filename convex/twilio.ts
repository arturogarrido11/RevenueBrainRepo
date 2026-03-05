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
    const baseUrl = process.env.BASE_URL ?? ""

    console.log(
      JSON.stringify({
        event: "twilio.send_sms.start",
        to,
        from,
        twilioCallSid,
        callTimestamp,
      })
    )

    if (!accountSid || !authToken || !from) {
      console.error(
        JSON.stringify({
          event: "twilio.send_sms.error",
          reason: "missing_twilio_env",
        })
      )
      return
    }

    const call = await ctx.runQuery(internal.calls.getByCallSid, { twilioCallSid })
    if (!call) {
      console.warn(
        JSON.stringify({
          event: "twilio.send_sms.skipped",
          reason: "call_not_found",
          twilioCallSid,
        })
      )
      return
    }

    if (call.smsSent) {
      console.log(
        JSON.stringify({
          event: "twilio.send_sms.skipped",
          reason: "already_sent",
          twilioCallSid,
        })
      )
      return
    }

    const settings = await ctx.runQuery(internal.settings.getInternal)
    if (!settings.smsEnabled) {
      console.log(
        JSON.stringify({
          event: "twilio.send_sms.skipped",
          reason: "sms_disabled",
          twilioCallSid,
        })
      )
      return
    }

    const bookingLink = baseUrl ? `${baseUrl.replace(/\/$/, "")}/book` : ""

    const body = settings.smsTemplate
      .replace("{business_name}", settings.businessName)
      .replace("{caller_name}", call.callerName ?? "there")
      .replace("{callback_url}", bookingLink)

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

    const responseText = await response.text()

    if (response.ok) {
      await ctx.runMutation(internal.calls.markSmsSent, {
        twilioCallSid,
        smsBody: body,
      })

      console.log(
        JSON.stringify({
          event: "twilio.send_sms.success",
          twilioCallSid,
          status: response.status,
        })
      )
    } else {
      console.error(
        JSON.stringify({
          event: "twilio.send_sms.error",
          twilioCallSid,
          status: response.status,
          error: responseText,
        })
      )
    }
  },
})
