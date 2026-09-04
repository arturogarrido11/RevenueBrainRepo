/**
 * Tool registry — maps function names to handlers and exports tool definitions.
 */

import type { SessionState } from "../session.js"
import { captureLeadDefinition, captureLeadHandler } from "./capture-lead.js"
import { endCallDefinition, endCallHandler } from "./end-call.js"
import { transferCallDefinition, transferCallHandler } from "./transfer-call.js"
import { checkAvailabilityDefinition, checkAvailabilityHandler } from "./check-availability.js"
import { bookAppointmentDefinition, bookAppointmentHandler } from "./book-appointment.js"

export const TOOL_DEFINITIONS = [
  captureLeadDefinition,
  checkAvailabilityDefinition,
  bookAppointmentDefinition,
  transferCallDefinition,
  endCallDefinition,
]

type ToolHandler = (args: Record<string, unknown>, state: SessionState) => Promise<object>

const TOOL_HANDLERS: Record<string, ToolHandler> = {
  capture_lead: captureLeadHandler as unknown as ToolHandler,
  end_call: endCallHandler as unknown as ToolHandler,
  transfer_call: transferCallHandler as unknown as ToolHandler,
  check_availability: checkAvailabilityHandler as unknown as ToolHandler,
  book_appointment: bookAppointmentHandler as unknown as ToolHandler,
}

/**
 * Dispatch a tool call by name and return the JSON-stringified result.
 * Errors are caught and returned as an error result to avoid crashing the session.
 */
export async function dispatchTool(
  name: string,
  argumentsJson: string,
  state: SessionState
): Promise<string> {
  const handler = TOOL_HANDLERS[name]
  if (!handler) {
    console.warn(JSON.stringify({ event: "tools.unknown_tool", name }))
    return JSON.stringify({ error: `Unknown tool: ${name}` })
  }

  let args: Record<string, unknown> = {}
  try {
    args = JSON.parse(argumentsJson || "{}")
  } catch {
    return JSON.stringify({ error: "Invalid tool arguments JSON." })
  }

  try {
    const result = await handler(args, state)
    return JSON.stringify(result)
  } catch (err) {
    console.error(JSON.stringify({ event: "tools.dispatch_error", name, error: String(err) }))
    return JSON.stringify({ error: `Tool ${name} failed: ${String(err)}` })
  }
}
