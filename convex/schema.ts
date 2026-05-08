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
      v.literal("ai_recorded")
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
})
