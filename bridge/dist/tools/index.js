/**
 * Tool registry — maps function names to handlers and exports tool definitions.
 */
import { captureLeadDefinition, captureLeadHandler } from "./capture-lead.js";
import { endCallDefinition, endCallHandler } from "./end-call.js";
import { transferCallDefinition, transferCallHandler } from "./transfer-call.js";
import { checkAvailabilityDefinition, checkAvailabilityHandler } from "./check-availability.js";
import { bookAppointmentDefinition, bookAppointmentHandler } from "./book-appointment.js";
export const TOOL_DEFINITIONS = [
    captureLeadDefinition,
    checkAvailabilityDefinition,
    bookAppointmentDefinition,
    transferCallDefinition,
    endCallDefinition,
];
const TOOL_HANDLERS = {
    capture_lead: captureLeadHandler,
    end_call: endCallHandler,
    transfer_call: transferCallHandler,
    check_availability: checkAvailabilityHandler,
    book_appointment: bookAppointmentHandler,
};
/**
 * Dispatch a tool call by name and return the JSON-stringified result.
 * Errors are caught and returned as an error result to avoid crashing the session.
 */
export async function dispatchTool(name, argumentsJson, state) {
    const handler = TOOL_HANDLERS[name];
    if (!handler) {
        console.warn(JSON.stringify({ event: "tools.unknown_tool", name }));
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
    let args = {};
    try {
        args = JSON.parse(argumentsJson || "{}");
    }
    catch {
        return JSON.stringify({ error: "Invalid tool arguments JSON." });
    }
    try {
        const result = await handler(args, state);
        return JSON.stringify(result);
    }
    catch (err) {
        console.error(JSON.stringify({ event: "tools.dispatch_error", name, error: String(err) }));
        return JSON.stringify({ error: `Tool ${name} failed: ${String(err)}` });
    }
}
//# sourceMappingURL=index.js.map