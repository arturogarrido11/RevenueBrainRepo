import {
  query,
  mutation,
  internalQuery,
  internalMutation,
  action,
} from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { internal } from "./_generated/api"

// ── Public queries ─────────────────────────────────────────────────────────

/**
 * Returns the business row for the currently authenticated user, or null.
 */
export const getMyBusiness = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    return await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
  },
})

// ── Internal queries ────────────────────────────────────────────────────────

export const getByUserId = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
  },
})

export const get = internalQuery({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, { businessId }) => {
    return await ctx.db.get(businessId)
  },
})

// ── Public mutations ────────────────────────────────────────────────────────

/**
 * Called from the signup page after the user has been created by Convex Auth.
 * Creates the business record and sets up a 14-day trial.
 */
export const createForCurrentUser = mutation({
  args: {
    businessName: v.string(),
    ownerEmail: v.string(),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, { businessName, ownerEmail, timezone }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    // Idempotent: if a business already exists for this user, return it
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (existing) return existing._id

    const trialEndsAt = Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days

    return await ctx.db.insert("businesses", {
      userId,
      businessName,
      ownerEmail,
      timezone: timezone ?? "America/New_York",
      plan: "trial",
      trialEndsAt,
      onboardingCompleted: false,
      createdAt: Date.now(),
    })
  },
})

/**
 * Update basic business info (authenticated — only the owner can update).
 */
export const update = mutation({
  args: {
    businessName: v.optional(v.string()),
    industry: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    timezone: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (!business) throw new Error("Business not found")

    // Filter out undefined values
    const updates = Object.fromEntries(
      Object.entries(args).filter(([, v]) => v !== undefined)
    )
    await ctx.db.patch(business._id, updates)
    return business._id
  },
})

// ── Internal mutations ──────────────────────────────────────────────────────

export const createInternal = internalMutation({
  args: {
    userId: v.string(),
    businessName: v.string(),
    ownerEmail: v.string(),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, { userId, businessName, ownerEmail, timezone }) => {
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
    if (existing) return existing._id

    const trialEndsAt = Date.now() + 14 * 24 * 60 * 60 * 1000
    return await ctx.db.insert("businesses", {
      userId,
      businessName,
      ownerEmail,
      timezone: timezone ?? "America/New_York",
      plan: "trial",
      trialEndsAt,
      onboardingCompleted: false,
      createdAt: Date.now(),
    })
  },
})

// ── Twilio number provisioning ──────────────────────────────────────────────

/**
 * Provisions a Twilio phone number for a business:
 * 1. Searches for available local numbers in the given area code.
 * 2. Purchases the first available number.
 * 3. Configures Twilio webhooks to point at this Convex deployment.
 * 4. Saves the number in the phone_numbers table.
 */
export const provisionPhoneNumber = action({
  args: {
    businessId: v.id("businesses"),
    areaCode: v.optional(v.string()),
  },
  handler: async (ctx, { businessId, areaCode }) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const convexSiteUrl = process.env.CONVEX_SITE_URL

    if (!accountSid || !authToken || !convexSiteUrl) {
      throw new Error("Missing Twilio credentials or CONVEX_SITE_URL env var")
    }

    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")

    // Search for available numbers
    const searchParams = new URLSearchParams({ SmsEnabled: "true", VoiceEnabled: "true" })
    if (areaCode) searchParams.set("AreaCode", areaCode)
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?${searchParams}`

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Basic ${basicAuth}` },
    })
    if (!searchRes.ok) {
      const err = await searchRes.text()
      throw new Error(`Twilio search failed: ${err}`)
    }
    const searchData: { available_phone_numbers?: Array<{ phone_number: string }> } =
      await searchRes.json()
    const number = searchData.available_phone_numbers?.[0]?.phone_number
    if (!number) {
      throw new Error(`No numbers available${areaCode ? ` in area code ${areaCode}` : ""}`)
    }

    // Purchase the number and wire up webhooks
    const buyRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          PhoneNumber: number,
          VoiceUrl: `${convexSiteUrl}/voice`,
          VoiceMethod: "POST",
          StatusCallback: `${convexSiteUrl}/voice/status`,
          StatusCallbackMethod: "POST",
          SmsUrl: `${convexSiteUrl}/sms`,
          SmsMethod: "POST",
        }).toString(),
      }
    )
    if (!buyRes.ok) {
      const err = await buyRes.text()
      throw new Error(`Twilio purchase failed: ${err}`)
    }
    const buyData: { sid?: string } = await buyRes.json()
    if (!buyData.sid) throw new Error("Twilio purchase response missing SID")

    // Persist to Convex
    await ctx.runMutation(internal.phone_numbers.create, {
      businessId,
      twilioPhoneNumber: number,
      twilioPhoneSid: buyData.sid,
      areaCode: areaCode ?? number.slice(2, 5),
      status: "active",
      createdAt: Date.now(),
    })

    return { phoneNumber: number, sid: buyData.sid }
  },
})
