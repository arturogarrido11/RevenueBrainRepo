import { query, internalMutation } from "./_generated/server"
import { v } from "convex/values"

// ── Public queries ────────────────────────────────────────────────────────────

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit ?? 100)
  },
})

export const getByCall = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, { callId }) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_call", (q) => q.eq("callId", callId))
      .first()
  },
})

// ── Internal mutations (called from HTTP actions) ─────────────────────────────

export const create = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      ...args,
      timestamp: Date.now(),
    })
  },
})

export const updateBookingResult = internalMutation({
  args: {
    appointmentId: v.id("appointments"),
    bookingStatus: v.union(
      v.literal("captured"),
      v.literal("booked"),
      v.literal("failed"),
      v.literal("transferred")
    ),
    calendarBookingId: v.optional(v.string()),
    calendarBookingUrl: v.optional(v.string()),
    calendarStartTime: v.optional(v.string()),
    calendarEndTime: v.optional(v.string()),
  },
  handler: async (ctx, { appointmentId, ...update }) => {
    await ctx.db.patch(appointmentId, update)
  },
})
