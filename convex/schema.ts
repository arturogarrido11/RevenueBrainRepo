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
      v.literal("pending")
    ),
    responseChannel: v.union(
      v.literal("sms"),
      v.literal("email"),
      v.literal("none")
    ),
    responseTime: v.optional(v.number()), // seconds after call
    smsSent: v.boolean(),
    smsBody: v.optional(v.string()),
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
  }).index("by_phone", ["phoneNumber"]),

  settings: defineTable({
    businessName: v.string(),
    smsTemplate: v.string(),
    smsEnabled: v.boolean(),
    responseDelaySeconds: v.number(),
  }),
})
