/**
 * end_call tool — hangs up the Twilio call via REST API.
 */
import type { SessionState } from "../session.js";
interface EndCallArgs {
    summary: string;
}
export declare function endCallHandler(args: EndCallArgs, state: SessionState): Promise<object>;
export declare const endCallDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            summary: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export {};
//# sourceMappingURL=end-call.d.ts.map