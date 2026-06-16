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
