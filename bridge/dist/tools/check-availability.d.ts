/**
 * check_availability tool — fetches available appointment slots from the
 * configured calendar provider (Calendly, Cal.com) or returns capture-only
 * placeholder slots.
 */
import type { SessionState } from "../session.js";
interface CheckAvailabilityArgs {
    preferred_date?: string;
    timezone?: string;
}
export declare function checkAvailabilityHandler(args: CheckAvailabilityArgs, state: SessionState): Promise<object>;
export declare const checkAvailabilityDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            preferred_date: {
                type: string;
                description: string;
            };
            timezone: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export {};
//# sourceMappingURL=check-availability.d.ts.map