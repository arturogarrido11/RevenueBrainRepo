/**
 * book_appointment tool — books an appointment via the configured calendar
 * provider, or captures the preferred time if in capture_only mode.
 */
/** Cal.com: POST /v2/bookings */
async function bookCalCom(args, config) {
    const apiKey = config?.calendarApiKey;
    const eventTypeId = config?.calendarEventTypeId;
    const tz = config?.businessHoursTimezone ?? "America/New_York";
    if (!apiKey || !eventTypeId || !args.datetime_utc) {
        return { success: false, error: "Missing calendar configuration or appointment time." };
    }
    const body = {
        eventTypeId: parseInt(eventTypeId, 10),
        start: args.datetime_utc,
        attendee: {
            name: args.caller_name,
            email: args.caller_email ?? "noreply@example.com",
            phoneNumber: args.caller_phone,
            timeZone: tz,
        },
        metadata: {
            notes: args.notes ?? "",
            source: "Revenue Brain AI Receptionist",
        },
    };
    const res = await fetch("https://api.cal.com/v2/bookings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "cal-api-version": "2026-02-25",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        console.error(JSON.stringify({ event: "tool.book_appointment.calcom_error", status: res.status, body: text }));
        return {
            success: false,
            error: "That time slot is no longer available. Please call check_availability again.",
        };
    }
    const data = (await res.json());
    const uid = data.data?.uid ?? "";
    const start = data.data?.start ?? args.datetime_utc;
    return {
        success: true,
        confirmation: `Booked for ${new Date(start).toLocaleString("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}.`,
        booking_reference: uid,
        _internal: {
            callerName: args.caller_name,
            callerEmail: args.caller_email,
            callerNotes: args.notes,
            requestedDatetime: args.datetime_utc,
            requestedDatetimeRaw: args.datetime_raw,
            bookingStatus: "booked",
            calendarProvider: "cal_com",
            calendarBookingId: uid,
            calendarStartTime: start,
            calendarEndTime: data.data?.end,
        },
    };
}
/** Calendly: POST /invitees */
async function bookCalendly(args, config) {
    const apiKey = config?.calendarApiKey;
    const eventTypeUri = config?.calendarEventTypeId;
    const tz = config?.businessHoursTimezone ?? "America/New_York";
    if (!apiKey || !eventTypeUri || !args.datetime_utc) {
        return { success: false, error: "Missing Calendly configuration or appointment time." };
    }
    const body = {
        event_type: eventTypeUri,
        start_time: args.datetime_utc,
        invitee: {
            name: args.caller_name,
            email: args.caller_email ?? "noreply@example.com",
            timezone: tz,
        },
        location: args.caller_phone
            ? { kind: "phone_call", location: args.caller_phone }
            : undefined,
    };
    const res = await fetch("https://api.calendly.com/invitees", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        console.error(JSON.stringify({ event: "tool.book_appointment.calendly_error", status: res.status, body: text }));
        return {
            success: false,
            error: "That time slot is no longer available. Please call check_availability again.",
        };
    }
    const data = (await res.json());
    const uri = data.resource?.uri ?? "";
    return {
        success: true,
        confirmation: `Booked for ${new Date(args.datetime_utc).toLocaleString("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}.`,
        booking_reference: uri,
        _internal: {
            callerName: args.caller_name,
            callerEmail: args.caller_email,
            callerNotes: args.notes,
            requestedDatetime: args.datetime_utc,
            requestedDatetimeRaw: args.datetime_raw,
            bookingStatus: "booked",
            calendarProvider: "calendly",
            calendarBookingId: uri,
            calendarStartTime: args.datetime_utc,
        },
    };
}
/** capture_only mode — just store the time, no API call. */
function captureAppointment(args) {
    return {
        success: true,
        confirmation: args.datetime_raw
            ? `I've noted your preference for ${args.datetime_raw}. Someone from our team will confirm via text or callback.`
            : `I've noted your appointment request. Someone from our team will confirm the time with you shortly.`,
        booking_reference: `captured-${Date.now()}`,
        _internal: {
            callerName: args.caller_name,
            callerEmail: args.caller_email,
            callerNotes: args.notes,
            requestedDatetime: args.datetime_utc,
            requestedDatetimeRaw: args.datetime_raw,
            bookingStatus: "captured",
        },
    };
}
export async function bookAppointmentHandler(args, state) {
    console.log(JSON.stringify({
        event: "tool.book_appointment",
        callSid: state.callSid,
        args: { ...args, caller_email: args.caller_email ? "[redacted]" : undefined },
    }));
    const schedulingMode = state.config?.schedulingMode ?? "capture_only";
    const provider = state.config?.calendarProvider;
    let result;
    try {
        if (schedulingMode === "capture_only") {
            result = captureAppointment(args);
        }
        else if (provider === "cal_com") {
            result = await bookCalCom(args, state.config);
        }
        else if (provider === "calendly") {
            result = await bookCalendly(args, state.config);
        }
        else {
            result = captureAppointment(args);
        }
    }
    catch (err) {
        console.error(JSON.stringify({
            event: "tool.book_appointment.error",
            callSid: state.callSid,
            error: String(err),
        }));
        // Fallback to capture on any API error
        result = captureAppointment(args);
    }
    // Store in session state for session-end webhook
    if (result._internal) {
        state.pendingAppointment = result._internal;
        state.callOutcome = "appointment_scheduled";
    }
    // Strip internal field from AI response
    const { _internal, ...aiResponse } = result;
    return aiResponse;
}
export const bookAppointmentDefinition = {
    type: "function",
    name: "book_appointment",
    description: "Book an appointment for the caller at a specific date and time. Always call check_availability first and confirm the time with the caller before calling this.",
    parameters: {
        type: "object",
        properties: {
            datetime_utc: {
                type: "string",
                description: "The appointment start time in UTC ISO 8601 format, e.g. 2026-09-08T14:00:00Z",
            },
            caller_name: {
                type: "string",
                description: "The caller's full name.",
            },
            caller_email: {
                type: "string",
                description: "The caller's email address, if provided.",
            },
            caller_phone: {
                type: "string",
                description: "The caller's phone number in E.164 format.",
            },
            notes: {
                type: "string",
                description: "Any notes about the purpose of the appointment.",
            },
            datetime_raw: {
                type: "string",
                description: "The raw time the caller mentioned, e.g. 'next Tuesday at 2pm'. Used as fallback if UTC conversion is uncertain.",
            },
        },
        required: ["caller_name", "caller_phone"],
    },
};
//# sourceMappingURL=book-appointment.js.map