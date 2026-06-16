import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"

export const getByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, { phoneNumber }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", phoneNumber))
      .order("asc")
      .collect()
  },
})

export const insert = internalMutation({
  args: {
    phoneNumber: v.string(),
    direction: v.union(v.literal("outbound"), v.literal("inbound")),
    body: v.string(),
    sentBy: v.optional(v.string()),
  },
  handler: async (ctx, { phoneNumber, direction, body, sentBy }) => {
    await ctx.db.insert("messages", {
      phoneNumber,
      direction,
      body,
      timestamp: Date.now(),
      sentBy,
    })
  },
})
