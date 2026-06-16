import { query } from "./_generated/server"
import { v } from "convex/values"

export const listRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20)
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
