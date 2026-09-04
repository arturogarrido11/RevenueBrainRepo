/**
 * book_appointment tool — books an appointment via the configured calendar
 * provider, or captures the preferred time if in capture_only mode.
 */
import type { SessionState } from "../session.js";
interface BookAppointmentArgs {
    datetime_utc?: string;
    caller_name: string;
    caller_email?: string;
    caller_phone?: string;
    notes?: string;
    datetime_raw?: string;
}
export declare function bookAppointmentHandler(args: BookAppointmentArgs, state: SessionState): Promise<object>;
export declare const bookAppointmentDefinition: {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            datetime_utc: {
                type: string;
                description: string;
            };
            caller_name: {
                type: string;
                description: string;
            };
            caller_email: {
                type: string;
                description: string;
            };
            caller_phone: {
                type: string;
                description: string;
            };
            notes: {
                type: string;
                description: string;
            };
            datetime_raw: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export {};
//# sourceMappingURL=book-appointment.d.ts.map