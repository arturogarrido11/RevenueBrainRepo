import { query, internalQuery, mutation } from "./_generated/server"
import { v } from "convex/values"

// Default config returned when no row exists yet
const DEFAULTS = {
  triggerMode: "missed_only" as const,
  personaName: "Alex",
  personaInstructions: undefined,
  greetingMessage: undefined,
  faqs: [],
  schedulingMode: "capture_only" as const,
  calendarProvider: undefined,
  calendarApiKey: undefined,
  calendarEventTypeId: undefined,
  businessHoursTimezone: "America/New_York",
  businessHoursStart: "09:00",
  businessHoursEnd: "17:00",
  businessDays: [1, 2, 3, 4, 5],
  forwardToNumber: undefined,
  forwardRingTimeoutSec: 25,
  escalationNumber: undefined,
  enabled: false,
  updatedAt: 0,
}

// ── Public query (used from dashboard) ──────────────────────────────────────
export const get = query({
  handler: async (ctx) => {
    const config = await ctx.db.query("receptionist_config").first()
    return config ?? DEFAULTS
  },
})

// ── Internal query (used from HTTP actions) ──────────────────────────────────
export const getInternal = internalQuery({
  handler: async (ctx) => {
    const config = await ctx.db.query("receptionist_config").first()
    return config ?? DEFAULTS
  },
})

// ── Upsert mutation (used from dashboard) ────────────────────────────────────
export const upsert = mutation({
  args: {
    triggerMode: v.union(
      v.literal("always_on"),
      v.literal("missed_only"),
      v.literal("after_hours")
    ),
    personaName: v.string(),
    personaInstructions: v.optional(v.string()),
    greetingMessage: v.optional(v.string()),
    faqs: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    schedulingMode: v.union(
      v.literal("capture_only"),
      v.literal("live_book")
    ),
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar"),
      v.literal("none")
    )),
    calendarApiKey: v.optional(v.string()),
    calendarEventTypeId: v.optional(v.string()),
    businessHoursTimezone: v.optional(v.string()),
    businessHoursStart: v.optional(v.string()),
    businessHoursEnd: v.optional(v.string()),
    businessDays: v.optional(v.array(v.number())),
    forwardToNumber: v.optional(v.string()),
    forwardRingTimeoutSec: v.optional(v.number()),
    escalationNumber: v.optional(v.string()),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("receptionist_config").first()
    const data = { ...args, updatedAt: Date.now() }
    if (existing) {
      await ctx.db.patch(existing._id, data)
    } else {
      await ctx.db.insert("receptionist_config", data)
    }
  },
})

// ── Enable/disable toggle ─────────────────────────────────────────────────────
export const setEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, { enabled }) => {
    const existing = await ctx.db.query("receptionist_config").first()
    if (existing) {
      await ctx.db.patch(existing._id, { enabled, updatedAt: Date.now() })
    }
  },
})
