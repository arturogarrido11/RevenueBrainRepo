/**
 * transfer_call tool — redirects the active Twilio call to the escalation
 * number via Twilio REST API call redirect.
 */

import type { SessionState } from "../session.js"

interface TransferCallArgs {
  reason: string
}

export async function transferCallHandler(
  args: TransferCallArgs,
  state: SessionState
): Promise<object> {
  console.log(JSON.stringify({
    event: "tool.transfer_call",
    callSid: state.callSid,
    reason: args.reason,
  }))

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const convexSiteUrl = process.env.CONVEX_SITE_URL

  if (!accountSid || !authToken || !convexSiteUrl) {
    return {
      success: false,
      error: "Transfer not configured. Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or CONVEX_SITE_URL.",
    }
  }

  if (!state.callSid) {
    return { success: false, error: "No active call to transfer." }
  }

  try {
    const transferTwimlUrl = `${convexSiteUrl}/voice/transfer-twiml`
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${state.callSid}.json`
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64")

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        Url: transferTwimlUrl,
        Method: "POST",
      }).toString(),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(JSON.stringify({
        event: "tool.transfer_call.twilio_error",
        callSid: state.callSid,
        status: res.status,
        body: text,
      }))
      return { success: false, error: "Transfer request failed. Please try again." }
    }

    state.callOutcome = "transferred"
    state.shouldClose = true

    return { success: true, message: "Transferring now." }
  } catch (err) {
    console.error(JSON.stringify({
      event: "tool.transfer_call.exception",
      callSid: state.callSid,
      error: String(err),
    }))
    return { success: false, error: "Transfer failed due to an unexpected error." }
  }
}

export const transferCallDefinition = {
  type: "function" as const,
  name: "transfer_call",
  description:
    "Transfer the caller to a human. Use this when: the caller explicitly asks to speak to a person, the caller is upset or distressed, or the inquiry is too complex for AI to handle.",
  parameters: {
    type: "object",
    properties: {
      reason: {
        type: "string",
        description: "Why the call is being transferred.",
      },
    },
    required: ["reason"],
  },
}
