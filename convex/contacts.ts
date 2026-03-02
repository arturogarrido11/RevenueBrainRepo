import { query, internalMutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_phone")
      .order("desc")
      .collect()
  },
})

export const upsertByPhone = internalMutation({
  args: {
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),
    responseChannel: v.optional(
      v.union(v.literal("sms"), v.literal("email"), v.literal("none"))
    ),
  },
  handler: async (ctx, { phoneNumber, callerName, responseChannel }) => {
    const now = Date.now()
    const existing = await ctx.db
      .query("contacts")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", phoneNumber))
      .first()

    if (existing) {
      const newTotalCalls = existing.totalCalls + 1
      const prevResponded = Math.round(
        existing.responseRate * existing.totalCalls
      )
      const newResponded =
        responseChannel && responseChannel !== "none"
          ? prevResponded + 1
          : prevResponded

      const daysSinceLastCall =
        (now - existing.lastCalledAt) / (1000 * 60 * 60 * 24)
      const status: "active" | "lapsed" =
        daysSinceLastCall > 30 ? "lapsed" : "active"

      await ctx.db.patch(existing._id, {
        name: callerName ?? existing.name,
        totalCalls: newTotalCalls,
        lastCalledAt: now,
        lastResponseChannel: responseChannel ?? existing.lastResponseChannel,
        responseRate: newResponded / newTotalCalls,
        status,
      })
    } else {
      await ctx.db.insert("contacts", {
        name: callerName,
        phoneNumber,
        totalCalls: 1,
        lastCalledAt: now,
        lastResponseChannel: responseChannel,
        responseRate: 0,
        status: "new",
      })
    }
  },
})
