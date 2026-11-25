import { query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

export const listRecent = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique()
    if (!business) return []
    // leads.businessId stored as string (backward compat)
    const all = await ctx.db
      .query("leads")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100)
    return all.filter((l) => l.businessId === (business._id as string)).slice(0, 20)
  },
})

export const getLeadsByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, { phoneNumber }) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_phone", (q) => q.eq("fromPhoneNumber", phoneNumber))
      .order("desc")
      .collect()
  },
})

export const listFiltered = query({
  args: {
    dateRange: v.optional(v.union(
      v.literal("today"),
      v.literal("7d"),
      v.literal("30d"),
      v.literal("month")
    )),
  },
  handler: async (ctx, { dateRange }) => {
    let leads = await ctx.db
      .query("leads")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100)

    if (dateRange) {
      const now = Date.now()
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const cutoffs: Record<string, number> = {
        today: todayStart.getTime(),
        "7d": now - 7 * 24 * 60 * 60 * 1000,
        "30d": now - 30 * 24 * 60 * 60 * 1000,
        month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
      }
      const cutoff = cutoffs[dateRange]
      if (cutoff) leads = leads.filter((l) => l.timestamp >= cutoff)
    }

    return leads
  },
})
