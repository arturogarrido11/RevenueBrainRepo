/**
 * end_call tool — hangs up the Twilio call via REST API.
 */
export async function endCallHandler(args, state) {
    console.log(JSON.stringify({
        event: "tool.end_call",
        callSid: state.callSid,
        summary: args.summary,
    }));
    state.endCallSummary = args.summary;
    if (!state.callOutcome) {
        state.callOutcome = "answered_ai";
    }
    // Hang up via Twilio REST API
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (accountSid && authToken && state.callSid) {
            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${state.callSid}.json`;
            const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
            await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "Status=completed",
            });
        }
    }
    catch (err) {
        console.error(JSON.stringify({
            event: "tool.end_call.twilio_error",
            callSid: state.callSid,
            error: String(err),
        }));
    }
    // Signal the session to close
    state.shouldClose = true;
    return { success: true };
}
export const endCallDefinition = {
    type: "function",
    name: "end_call",
    description: "End the call after you have said a proper goodbye and the caller has confirmed they have no more questions.",
    parameters: {
        type: "object",
        properties: {
            summary: {
                type: "string",
                description: "1-2 sentence summary of what was accomplished in this call.",
            },
        },
        required: ["summary"],
    },
};
//# sourceMappingURL=end-call.js.map