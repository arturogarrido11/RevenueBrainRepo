import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  // ──────────────────────────────────────────────────────────────────────────
  // Multi-tenancy: one row per signed-up business account
  // ──────────────────────────────────────────────────────────────────────────
  businesses: defineTable({
    userId: v.string(),             // Convex Auth user ID
    businessName: v.string(),
    industry: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    timezone: v.string(),            // IANA, default "America/New_York"
    ownerEmail: v.string(),
    ownerPhone: v.optional(v.string()), // for SMS notifications
    // Subscription
    plan: v.union(v.literal("trial"), v.literal("starter"), v.literal("pro")),
    trialEndsAt: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // ──────────────────────────────────────────────────────────────────────────
  // Twilio phone numbers assigned to businesses
  // ──────────────────────────────────────────────────────────────────────────
  phone_numbers: defineTable({
    businessId: v.id("businesses"),
    twilioPhoneNumber: v.string(),   // E.164, e.g. "+17865551234"
    twilioPhoneSid: v.string(),      // Twilio IncomingPhoneNumber SID
    areaCode: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("released")),
    createdAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_number", ["twilioPhoneNumber"]),

  // ──────────────────────────────────────────────────────────────────────────
  // Calls — now with optional businessId for multi-tenant scoping
  // ──────────────────────────────────────────────────────────────────────────
  calls: defineTable({
    twilioCallSid: v.string(),
    callerName: v.optional(v.string()),
    phoneNumber: v.string(), // caller's number in E.164
    timestamp: v.number(),   // Unix ms
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
    // Multi-tenancy: optional for backward compat with legacy data
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_phone", ["phoneNumber"])
    .index("by_callSid", ["twilioCallSid"])
    .index("by_business", ["businessId"])
    .index("by_business_timestamp", ["businessId", "timestamp"]),

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
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_phone", ["phoneNumber"])
    .index("by_business", ["businessId"]),

  settings: defineTable({
    businessName: v.string(),
    smsTemplate: v.string(),
    smsEnabled: v.boolean(),
    responseDelaySeconds: v.number(),
    ownerAlertEmailEnabled: v.optional(v.boolean()),
    ownerEmail: v.optional(v.string()),
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_business", ["businessId"]),

  leads: defineTable({
    fromPhoneNumber: v.string(),
    messageBody: v.string(),
    timestamp: v.number(),
    // businessId stored as string for backward compat (old rows have phone number here).
    // New rows will store the Convex Id<"businesses"> as a string.
    businessId: v.optional(v.string()),
    twilioMessageSid: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_phone", ["fromPhoneNumber"])
    .index("by_business", ["businessId"]),

  messages: defineTable({
    phoneNumber: v.string(),
    direction: v.union(v.literal("outbound"), v.literal("inbound")),
    body: v.string(),
    timestamp: v.number(),
    sentBy: v.optional(v.string()), // "auto" | "manual"
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_phone", ["phoneNumber"])
    .index("by_timestamp", ["timestamp"])
    .index("by_business", ["businessId"]),

  // ──────────────────────────────────────────────────────────────────────────
  // AI Voice Receptionist — config (now with optional businessId for multi-tenant)
  // ──────────────────────────────────────────────────────────────────────────
  receptionist_config: defineTable({
    // Trigger mode
    triggerMode: v.union(
      v.literal("always_on"),
      v.literal("missed_only"),
      v.literal("after_hours")
    ),
    // AI persona
    personaName: v.string(),
    personaInstructions: v.optional(v.string()),
    greetingMessage: v.optional(v.string()),
    faqs: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    // Scheduling mode
    schedulingMode: v.union(
      v.literal("capture_only"),
      v.literal("live_book")
    ),
    // Calendar provider
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar"),
      v.literal("none")
    )),
    calendarApiKey: v.optional(v.string()),
    calendarEventTypeId: v.optional(v.string()),
    // Business hours
    businessHoursTimezone: v.optional(v.string()),
    businessHoursStart: v.optional(v.string()),
    businessHoursEnd: v.optional(v.string()),
    businessDays: v.optional(v.array(v.number())),
    // Forwarding / escalation
    forwardToNumber: v.optional(v.string()),
    forwardRingTimeoutSec: v.optional(v.number()),
    escalationNumber: v.optional(v.string()),
    // Meta
    enabled: v.boolean(),
    updatedAt: v.number(),
    // Multi-tenancy
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_business", ["businessId"]),

  // ──────────────────────────────────────────────────────────────────────────
  // Appointment records from AI voice sessions
  // ──────────────────────────────────────────────────────────────────────────
  appointments: defineTable({
    callId: v.id("calls"),
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),
    requestedDatetime: v.optional(v.string()),
    requestedDatetimeRaw: v.optional(v.string()),
    bookingStatus: v.union(
      v.literal("captured"),
      v.literal("booked"),
      v.literal("failed"),
      v.literal("transferred")
    ),
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar")
    )),
    calendarBookingId: v.optional(v.string()),
    calendarBookingUrl: v.optional(v.string()),
    calendarStartTime: v.optional(v.string()),
    calendarEndTime: v.optional(v.string()),
    callerEmail: v.optional(v.string()),
    callerNotes: v.optional(v.string()),
    timestamp: v.number(),
    // Multi-tenancy
    businessId: v.optional(v.id("businesses")),
  })
    .index("by_call", ["callId"])
    .index("by_phone", ["phoneNumber"])
    .index("by_timestamp", ["timestamp"])
    .index("by_business", ["businessId"]),
})
