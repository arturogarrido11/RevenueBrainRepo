import { query, internalQuery, mutation, internalMutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
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

// ── Internal query by businessId (used from /api/business-config) ──────────
export const getByBusiness = internalQuery({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    const config = await ctx.db
      .query("receptionist_config")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .first()
    return config ?? { ...DEFAULTS, businessId }
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

// ── Onboarding: upsert for authenticated user's business ───────────────────────
export const upsertForBusiness = mutation({
  args: {
    triggerMode: v.optional(v.union(
      v.literal("always_on"),
      v.literal("missed_only"),
      v.literal("after_hours")
    )),
    personaName: v.optional(v.string()),
    personaInstructions: v.optional(v.string()),
    greetingMessage: v.optional(v.string()),
    faqs: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    services: v.optional(v.array(v.object({
      name: v.string(),
      price: v.optional(v.string()),
      duration: v.optional(v.number()),
    }))),
    businessHoursTimezone: v.optional(v.string()),
    businessHoursStart: v.optional(v.string()),
    businessHoursEnd: v.optional(v.string()),
    businessDays: v.optional(v.array(v.number())),
    businessHoursPerDay: v.optional(v.array(v.object({
      day: v.number(),
      open: v.boolean(),
      start: v.optional(v.string()),
      end: v.optional(v.string()),
    }))),
    schedulingMode: v.optional(v.union(
      v.literal("capture_only"),
      v.literal("live_book")
    )),
    calendarProvider: v.optional(v.union(
      v.literal("calendly"),
      v.literal("cal_com"),
      v.literal("google_calendar"),
      v.literal("none")
    )),
    calendarApiKey: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!business) throw new Error("Business not found")

    const existing = await ctx.db
      .query("receptionist_config")
      .withIndex("by_business", (q) => q.eq("businessId", business._id))
      .first()

    const patch: Record<string, unknown> = { businessId: business._id, updatedAt: Date.now() }
    for (const [key, val] of Object.entries(args)) {
      if (val !== undefined) patch[key] = val
    }

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.db.patch(existing._id, patch as any)
      return existing._id
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await ctx.db.insert("receptionist_config", {
        triggerMode: args.triggerMode ?? "missed_only",
        personaName: args.personaName ?? "Alex",
        schedulingMode: args.schedulingMode ?? "capture_only",
        enabled: args.enabled ?? false,
        ...patch,
      } as any)
    }
  },
})

// ── Get config for authenticated user's business ──────────────────────────────
export const getForMyBusiness = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!business) return null
    const config = await ctx.db
      .query("receptionist_config")
      .withIndex("by_business", (q) => q.eq("businessId", business._id))
      .first()
    return config ?? { ...DEFAULTS, businessId: business._id }
  },
})
