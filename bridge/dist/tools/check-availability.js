/**
 * check_availability tool — fetches available appointment slots from the
 * configured calendar provider (Calendly, Cal.com) or returns capture-only
 * placeholder slots.
 */
function formatDisplay(utcIso, tz) {
    try {
        const date = new Date(utcIso);
        return date.toLocaleString("en-US", {
            timeZone: tz,
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }
    catch {
        return utcIso;
    }
}
/** Returns 3 placeholder slots starting tomorrow for capture_only mode. */
function captureOnlySlots(tz) {
    const slots = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(14, 0, 0, 0); // 10 AM ET = 14:00 UTC (approx)
    for (let i = 0; i < 3; i++) {
        const dt = new Date(tomorrow);
        dt.setUTCHours(14 + i * 4, 0, 0, 0);
        slots.push({
            datetime_utc: dt.toISOString(),
            display: formatDisplay(dt.toISOString(), tz),
        });
    }
    return slots;
}
/** Cal.com: GET /v2/slots */
async function calComSlots(config, preferredDate, tz) {
    const apiKey = config?.calendarApiKey;
    const eventTypeId = config?.calendarEventTypeId;
    if (!apiKey || !eventTypeId)
        return [];
    const timezone = tz ?? config?.businessHoursTimezone ?? "America/New_York";
    const today = preferredDate ?? new Date().toISOString().split("T")[0];
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const endStr = end.toISOString().split("T")[0];
    const url = new URL("https://api.cal.com/v2/slots");
    url.searchParams.set("eventTypeId", String(eventTypeId));
    url.searchParams.set("start", today);
    url.searchParams.set("end", endStr);
    url.searchParams.set("timeZone", timezone);
    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "cal-api-version": "2024-09-04",
        },
    });
    if (!res.ok) {
        console.error(JSON.stringify({ event: "tool.check_availability.calcom_error", status: res.status }));
        return [];
    }
    const data = (await res.json());
    const slots = [];
    for (const [date, times] of Object.entries(data.slots ?? {})) {
        for (const t of times) {
            const utcIso = `${date}T${t.time}Z`;
            slots.push({ datetime_utc: utcIso, display: formatDisplay(utcIso, timezone) });
            if (slots.length >= 5)
                break;
        }
        if (slots.length >= 5)
            break;
    }
    return slots;
}
/** Calendly: GET /event_type_available_times */
async function calendlySlots(config, preferredDate, tz) {
    const apiKey = config?.calendarApiKey;
    const eventTypeUri = config?.calendarEventTypeId;
    if (!apiKey || !eventTypeUri)
        return [];
    const timezone = tz ?? config?.businessHoursTimezone ?? "America/New_York";
    const startTime = preferredDate
        ? new Date(preferredDate).toISOString()
        : new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const url = new URL("https://api.calendly.com/event_type_available_times");
    url.searchParams.set("event_type", eventTypeUri);
    url.searchParams.set("start_time", startTime);
    url.searchParams.set("end_time", endDate.toISOString());
    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
        console.error(JSON.stringify({ event: "tool.check_availability.calendly_error", status: res.status }));
        return [];
    }
    const data = (await res.json());
    return (data.collection ?? [])
        .filter((s) => s.status === "available")
        .slice(0, 5)
        .map((s) => ({
        datetime_utc: s.start_time,
        display: formatDisplay(s.start_time, timezone),
    }));
}
export async function checkAvailabilityHandler(args, state) {
    console.log(JSON.stringify({
        event: "tool.check_availability",
        callSid: state.callSid,
        args,
    }));
    const tz = args.timezone ?? state.config?.businessHoursTimezone ?? "America/New_York";
    try {
        const schedulingMode = state.config?.schedulingMode ?? "capture_only";
        const provider = state.config?.calendarProvider;
        let slots = [];
        if (schedulingMode === "capture_only") {
            slots = captureOnlySlots(tz);
        }
        else if (provider === "cal_com") {
            slots = await calComSlots(state.config, args.preferred_date, tz);
        }
        else if (provider === "calendly") {
            slots = await calendlySlots(state.config, args.preferred_date, tz);
        }
        else {
            // Fallback to capture-only slots
            slots = captureOnlySlots(tz);
        }
        return { available_slots: slots };
    }
    catch (err) {
        console.error(JSON.stringify({
            event: "tool.check_availability.error",
            callSid: state.callSid,
            error: String(err),
        }));
        return {
            available_slots: captureOnlySlots(tz),
            note: "Using estimated availability — final confirmation will be sent.",
        };
    }
}
export const checkAvailabilityDefinition = {
    type: "function",
    name: "check_availability",
    description: "Check available appointment times for the next 7 days. Call this before asking the caller to pick a time, so you can offer real options.",
    parameters: {
        type: "object",
        properties: {
            preferred_date: {
                type: "string",
                description: "Optional: date the caller prefers, in YYYY-MM-DD format. If not provided, check the next 3 business days.",
            },
            timezone: {
                type: "string",
                description: "Caller's timezone if mentioned (IANA format, e.g. America/New_York). Default to business timezone.",
            },
        },
        required: [],
    },
};
//# sourceMappingURL=check-availability.js.map