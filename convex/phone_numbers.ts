import { query, internalQuery, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

// ── Public queries ─────────────────────────────────────────────────────────

/**
 * Returns all phone numbers for the authenticated user's business.
 */
export const listMyNumbers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!business) return []

    return await ctx.db
      .query("phone_numbers")
      .withIndex("by_business", (q) => q.eq("businessId", business._id))
      .collect()
  },
})

// ── Internal queries ────────────────────────────────────────────────────────

/**
 * Look up which business owns a given E.164 phone number.
 * Used by /voice and /api/business-config to route calls to the right business.
 */
export const getByNumber = internalQuery({
  args: { twilioPhoneNumber: v.string() },
  handler: async (ctx, { twilioPhoneNumber }) => {
    return await ctx.db
      .query("phone_numbers")
      .withIndex("by_number", (q) => q.eq("twilioPhoneNumber", twilioPhoneNumber))
      .first()
  },
})

export const getByBusiness = internalQuery({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    return await ctx.db
      .query("phone_numbers")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .first()
  },
})

// ── Internal mutations ──────────────────────────────────────────────────────

export const create = internalMutation({
  args: {
    businessId: v.id("businesses"),
    twilioPhoneNumber: v.string(),
    twilioPhoneSid: v.string(),
    areaCode: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("released")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("phone_numbers", args)
  },
})

export const release = internalMutation({
  args: { twilioPhoneNumber: v.string() },
  handler: async (ctx, { twilioPhoneNumber }) => {
    const record = await ctx.db
      .query("phone_numbers")
      .withIndex("by_number", (q) => q.eq("twilioPhoneNumber", twilioPhoneNumber))
      .first()
    if (record) {
      await ctx.db.patch(record._id, { status: "released" })
    }
  },
})
