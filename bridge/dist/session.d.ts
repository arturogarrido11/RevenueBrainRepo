/**
 * Session manager — handles one Twilio ↔ OpenAI Realtime call session.
 *
 * Lifecycle:
 *   1. Twilio WebSocket connects with callSid, from, to query params
 *   2. Bridge opens OpenAI Realtime WebSocket + sends session.update
 *   3. Audio forwarding loop (Twilio μ-law 8kHz ↔ OpenAI PCM 16kHz)
 *   4. Tool calls handled mid-conversation
 *   5. On session end: POST summary to Convex /voice/session-end
 */
import WebSocket from "ws";
export interface ReceptionistConfig {
    personaName: string;
    personaInstructions?: string;
    greetingMessage?: string;
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
    schedulingMode: "capture_only" | "live_book";
    calendarProvider?: string | null;
    calendarApiKey?: string | null;
    calendarEventTypeId?: string | null;
    businessHoursTimezone?: string;
    escalationNumber?: string;
    enabled: boolean;
}
export interface SessionState {
    callSid: string;
    fromNumber: string;
    toNumber: string;
    startedAt: number;
    config?: ReceptionistConfig;
    capturedLead?: {
        callerName?: string;
        callerPhone?: string;
        callerEmail?: string;
        intent: string;
        priority?: "hot" | "warm" | "low";
    };
    pendingAppointment?: {
        callerName?: string;
        callerEmail?: string;
        callerNotes?: string;
        requestedDatetime?: string;
        requestedDatetimeRaw?: string;
        bookingStatus: "captured" | "booked" | "failed" | "transferred";
        calendarProvider?: "calendly" | "cal_com" | "google_calendar";
        calendarBookingId?: string;
        calendarBookingUrl?: string;
        calendarStartTime?: string;
        calendarEndTime?: string;
    };
    callOutcome?: "answered_ai" | "transferred" | "voicemail_captured" | "appointment_scheduled" | "abandoned";
    endCallSummary?: string;
    transcript?: string;
    shouldClose?: boolean;
}
export declare function handleSession(twilioWs: WebSocket, callSid: string, fromNumber: string, toNumber: string, configOverride?: Partial<ReceptionistConfig>): Promise<void>;
//# sourceMappingURL=session.d.ts.map