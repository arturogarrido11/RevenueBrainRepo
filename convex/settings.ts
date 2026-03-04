import { query, internalQuery, mutation } from "./_generated/server"
import { v } from "convex/values"

const DEFAULTS = {
  businessName: "My Business",
  smsTemplate:
    "Hi! Sorry we missed your call. Reply here with what you need, or book here: {callback_url}",
  smsEnabled: true,
  responseDelaySeconds: 0,
}

export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first()
    return settings ?? DEFAULTS
  },
})

// Used internally from Convex actions (avoids calling public API from action)
export const getInternal = internalQuery({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first()
    return settings ?? DEFAULTS
  },
})

export const upsert = mutation({
  args: {
    businessName: v.string(),
    smsTemplate: v.string(),
    smsEnabled: v.boolean(),
    responseDelaySeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
    } else {
      await ctx.db.insert("settings", args)
    }
  },
})
