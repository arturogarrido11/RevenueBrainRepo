import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  calls: defineTable({
    twilioCallSid: v.string(),
    callerName: v.optional(v.string()),
    phoneNumber: v.string(), // caller's number in E.164
    timestamp: v.number(), // Unix ms
    status: v.union(
      v.literal("missed"),
      v.literal("responded"),
      v.literal("pending"),
      v.literal("ai_recorded"),
      v.literal("answered_ai")
    ),
    responseChannel: v.union(
      v.literal("sms"),
      v.literal("email"),
      v.literal("none")
    ),
    responseTime: v.optional(v.number()), // seconds after call
    smsSent: v.boolean(),
    smsBody: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("standard"),
        v.literal("ai_receptionist")
      )
    ),
    channel: v.optional(
      v.union(
        v.literal("voice"),
        v.literal("sms")
      )
    ),
    recordingUrl: v.optional(v.string()),
    transcript: v.optional(v.string()),
    summary: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("hot"), v.literal("warm"), v.literal("low"))
    ),
    // AI Receptionist fields
    aiSessionId: v.optional(v.string()),
    callOutcome: v.optional(v.union(
      v.literal("answered_ai"),
      v.literal("transferred"),
      v.literal("voicemail_captured"),
      v.literal("appointment_scheduled"),
      v.literal("abandoned")
    )),
    appointmentId: v.optional(v.id("appointments")),
    callDurationSec: v.optional(v.number()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_phone", ["phoneNumber"])
    .index("by_callSid", ["twilioCallSid"]),

  contacts: defineTable({
    name: v.optional(v.string()),
    phoneNumber: v.string(),
    email: v.optional(v.string()),
    totalCalls: v.number(),
    lastCalledAt: v.number(),
    lastResponseChannel: v.optional(
      v.union(v.literal("sms"), v.literal("email"), v.literal("none"))
    ),
    responseRate: v.number(), // 0–1
    status: v.union(
      v.literal("new"),
      v.literal("active"),
      v.literal("lapsed")
    ),
    optedOut: v.optional(v.boolean()),
  }).index("by_phone", ["phoneNumber"]),

  settings: defineTable({
    businessName: v.string(),
    smsTemplate: v.string(),
    smsEnabled: v.boolean(),
    responseDelaySeconds: v.number(),
    ownerAlertEmailEnabled: v.optional(v.boolean()),
    ownerEmail: v.optional(v.string()),
  }),

  leads: defineTable({
    fromPhoneNumber: v.string(),
    messageBody: v.string(),
    timestamp: v.number(),
    businessId: v.optional(v.string()),
    twilioMessageSid: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_phone", ["fromPhoneNumber"]),

  messages: defineTable({
    phoneNumber: v.string(),   // the contact phone number
    direction: v.union(v.literal("outbound"), v.literal("inbound")),
    body: v.string(),
    timestamp: v.number(),
    sentBy: v.optional(v.string()), // "auto" | "manual"
  })
    .index("by_phone", ["phoneNumber"])
    .index("by_timestamp", ["timestamp"]),

  // ──────────────────────────────────────────────
  // AI Voice Receptionist — singleton config table
  // Same pattern as `settings` (single-tenant V1)
  // ──────────────────────────────────────────────
  receptionist_config: defineTable({
    // Trigger mode
    triggerMode: v.union(
      v.literal("always_on"),   // AI answers every inbound call
      v.literal("missed_only"), // AI activates after forward ring times out
      v.literal("after_hours")  // AI activates based on business hours schedule
    ),

    // AI persona
    personaName: v.string(),                              // e.g. "Sarah"
    personaInstructions: v.optional(v.string()),          // custom system prompt additions
    greetingMessage: v.optional(v.string()),              // first thing AI says
    faqs: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),

    // Scheduling mode
    schedulingMode: v.union(
      v.literal("capture_only"), // AI captures preferred time, no calendar API call
      v.literal("live_book")     // AI books directly via calendar API
    ),

    // Calendar provider (only relevant when schedulingMode == "live_book")
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar"),
      v.literal("none")
    )),
    calendarApiKey: v.optional(v.string()),      // Calendly PAT or Cal.com API key
    calendarEventTypeId: v.optional(v.string()), // Cal.com eventTypeId or Calendly event_type URI

    // Business hours (only relevant when triggerMode == "after_hours")
    businessHoursTimezone: v.optional(v.string()), // IANA tz e.g. "America/New_York"
    businessHoursStart: v.optional(v.string()),    // "09:00" (24hr)
    businessHoursEnd: v.optional(v.string()),      // "17:00" (24hr)
    businessDays: v.optional(v.array(v.number())), // [1,2,3,4,5] = Mon–Fri

    // Forwarding / escalation
    forwardToNumber: v.optional(v.string()),         // E.164 number to ring first (missed_only)
    forwardRingTimeoutSec: v.optional(v.number()),   // seconds to ring before AI takes over (default 25)
    escalationNumber: v.optional(v.string()),        // E.164 number for transfer_call tool

    // Meta
    enabled: v.boolean(),
    updatedAt: v.number(),
  }),

  // ──────────────────────────────────────────────
  // Appointment records from AI voice sessions
  // ──────────────────────────────────────────────
  appointments: defineTable({
    callId: v.id("calls"),
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),

    // Captured time preference (always populated)
    requestedDatetime: v.optional(v.string()),    // ISO 8601
    requestedDatetimeRaw: v.optional(v.string()), // raw text: "next Tuesday afternoon"

    // Live booking result
    bookingStatus: v.union(
      v.literal("captured"),    // time logged, no calendar booking
      v.literal("booked"),      // successfully booked via calendar API
      v.literal("failed"),      // calendar API call failed
      v.literal("transferred")  // call transferred before scheduling
    ),
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar")
    )),
    calendarBookingId: v.optional(v.string()),   // booking UID from Cal.com / Calendly
    calendarBookingUrl: v.optional(v.string()),  // confirmation URL / meeting link
    calendarStartTime: v.optional(v.string()),   // UTC ISO 8601
    calendarEndTime: v.optional(v.string()),     // UTC ISO 8601

    // Caller info captured during call
    callerEmail: v.optional(v.string()),
    callerNotes: v.optional(v.string()),

    timestamp: v.number(),
  })
    .index("by_call", ["callId"])
    .index("by_phone", ["phoneNumber"])
    .index("by_timestamp", ["timestamp"]),
})
