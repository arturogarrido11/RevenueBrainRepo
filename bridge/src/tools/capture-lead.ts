/**
 * capture_lead tool — stores caller info and intent in the session state.
 * The data is sent to Convex when the session ends via /voice/session-end.
 */

import type { SessionState } from "../session.js"

interface CaptureLeadArgs {
  caller_name?: string
  caller_phone?: string
  caller_email?: string
  intent: string
  priority?: "hot" | "warm" | "low"
}

export async function captureLeadHandler(
  args: CaptureLeadArgs,
  state: SessionState
): Promise<object> {
  console.log(JSON.stringify({
    event: "tool.capture_lead",
    callSid: state.callSid,
    args,
  }))

  // Persist in session state — sent to Convex at session end
  state.capturedLead = {
    callerName: args.caller_name,
    callerPhone: args.caller_phone ?? state.fromNumber,
    callerEmail: args.caller_email,
    intent: args.intent,
    priority: args.priority ?? "warm",
  }

  // Also update call outcome
  state.callOutcome = "voicemail_captured"

  return { success: true }
}

export const captureLeadDefinition = {
  type: "function" as const,
  name: "capture_lead",
  description:
    "Save the caller's contact information and the reason for their call. Call this at the end of any conversation where no appointment is being made.",
  parameters: {
    type: "object",
    properties: {
      caller_name: {
        type: "string",
        description: "The caller's full name.",
      },
      caller_phone: {
        type: "string",
        description: "The caller's phone number in E.164 format.",
      },
      caller_email: {
        type: "string",
        description: "The caller's email address, if provided.",
      },
      intent: {
        type: "string",
        description:
          "What the caller needs help with, in 1-2 sentences.",
      },
      priority: {
        type: "string",
        enum: ["hot", "warm", "low"],
        description:
          "hot = urgent/ready to buy, warm = interested but not urgent, low = general inquiry.",
      },
    },
    required: ["intent"],
  },
}
