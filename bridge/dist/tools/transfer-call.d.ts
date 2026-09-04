/**
 * transfer_call tool — redirects the active Twilio call to the escalation
 * number via Twilio REST API call redirect.
 */
import type { SessionState } from "../session.js";
interface TransferCallArgs {
    reason: string;
}
export declare function transferCallHandler(args: TransferCallArgs, state: SessionState): Promise<object>;
export declare const transferCallDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            reason: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export {};
//# sourceMappingURL=transfer-call.d.ts.map