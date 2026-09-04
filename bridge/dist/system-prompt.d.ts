/**
 * Builds the system prompt for the OpenAI Realtime session based on
 * the business's receptionist_config fetched from Convex.
 */
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
    businessHoursTimezone?: string;
    escalationNumber?: string;
    enabled: boolean;
}
export declare function buildSystemPrompt(config: ReceptionistConfig, businessName: string): string;
//# sourceMappingURL=system-prompt.d.ts.map