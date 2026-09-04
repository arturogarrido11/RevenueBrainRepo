/**
 * capture_lead tool — stores caller info and intent in the session state.
 * The data is sent to Convex when the session ends via /voice/session-end.
 */
import type { SessionState } from "../session.js";
interface CaptureLeadArgs {
    caller_name?: string;
    caller_phone?: string;
    caller_email?: string;
    intent: string;
    priority?: "hot" | "warm" | "low";
}
export declare function captureLeadHandler(args: CaptureLeadArgs, state: SessionState): Promise<object>;
export declare const captureLeadDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            caller_name: {
                type: string;
                description: string;
            };
            caller_phone: {
                type: string;
                description: string;
            };
            caller_email: {
                type: string;
                description: string;
            };
            intent: {
                type: string;
                description: string;
            };
            priority: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
export {};
//# sourceMappingURL=capture-lead.d.ts.map