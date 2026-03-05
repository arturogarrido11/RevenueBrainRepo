import { query } from "./_generated/server"

export const listRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20)
  },
})
