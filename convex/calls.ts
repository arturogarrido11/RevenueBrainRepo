import { query, internalMutation } from "./_generated/server"
import { v } from "convex/values"

export const listRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_timestamp")
      .order("desc")
      .take(8)
  },
})

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_timestamp")
      .order("desc")
      .collect()
  },
})

export const getStats = query({
  handler: async (ctx) => {
    const calls = await ctx.db.query("calls").collect()
    const contacts = await ctx.db.query("contacts").collect()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayMs = todayStart.getTime()

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const yesterdayMs = yesterdayStart.getTime()

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const todayCalls = calls.filter((c) => c.timestamp >= todayMs)
    const yesterdayCalls = calls.filter(
      (c) => c.timestamp >= yesterdayMs && c.timestamp < todayMs
    )
    const respondedCalls = calls.filter((c) => c.status === "responded")
    const responseTimes = calls
      .filter((c) => c.responseTime != null)
      .map((c) => c.responseTime as number)

    return {
      missedToday: todayCalls.length,
      missedYesterday: yesterdayCalls.length,
      responseRate:
        calls.length > 0 ? respondedCalls.length / calls.length : 0,
      avgResponseTimeSeconds:
        responseTimes.length > 0
          ? Math.round(
              responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            )
          : 0,
      totalContacts: contacts.length,
      newContactsThisWeek: contacts.filter((c) => c.lastCalledAt >= weekAgo)
        .length,
    }
  },
})

export const create = internalMutation({
  args: {
    twilioCallSid: v.string(),
    phoneNumber: v.string(),
    callerName: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    // Avoid duplicate entries for the same call
    const existing = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", args.twilioCallSid))
      .first()
    if (existing) return existing._id

    return await ctx.db.insert("calls", {
      twilioCallSid: args.twilioCallSid,
      phoneNumber: args.phoneNumber,
      callerName: args.callerName,
      timestamp: args.timestamp,
      status: "pending",
      responseChannel: "none",
      smsSent: false,
    })
  },
})

export const markSmsResponse = internalMutation({
  args: {
    twilioCallSid: v.string(),
    smsBody: v.string(),
    responseTime: v.number(),
  },
  handler: async (ctx, { twilioCallSid, smsBody, responseTime }) => {
    const call = await ctx.db
      .query("calls")
      .withIndex("by_callSid", (q) => q.eq("twilioCallSid", twilioCallSid))
      .first()

    if (call) {
      await ctx.db.patch(call._id, {
        status: "responded",
        responseChannel: "sms",
        responseTime,
        smsSent: true,
        smsBody,
      })
    }
  },
})
