#!/usr/bin/env node
import crypto from "node:crypto"
import { setTimeout as sleep } from "node:timers/promises"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api.js"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL
if (!convexUrl) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL)")
  process.exit(1)
}

const convexClientUrl = convexUrl.replace(/\/$/, "")
const baseUrl = convexClientUrl.replace(".convex.cloud", ".convex.site")
const secret = process.env.TWILIO_WEBHOOK_SECRET || process.env.TWILIO_AUTH_TOKEN || ""

function twilioSignature(url, params, authToken) {
  if (!authToken) return ""
  const sortedKeys = Object.keys(params).sort()
  let data = url
  for (const k of sortedKeys) data += k + String(params[k])
  return crypto.createHmac("sha1", authToken).update(data).digest("base64")
}

async function twilioPost(path, params) {
  const url = `${baseUrl}${path}`
  const body = new URLSearchParams(params).toString()
  const headers = { "Content-Type": "application/x-www-form-urlencoded" }

  if (secret) {
    headers["x-twilio-signature"] = twilioSignature(url, params, secret)
  }

  const res = await fetch(url, { method: "POST", headers, body })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${path} failed ${res.status}: ${text}`)
  }
  return text
}

async function main() {
  console.log(`Using Convex query URL: ${convexClientUrl}`)
  console.log(`Using Convex HTTP URL: ${baseUrl}`)

  const health = await fetch(`${baseUrl}/health`)
  if (!health.ok) {
    throw new Error(`/health failed: ${health.status}`)
  }
  console.log("✓ /health")

  const nonce = Date.now().toString().slice(-6)
  const phone = `+1555${nonce}`
  const callSid = `CA_SMOKE_${Date.now()}`
  const messageSid = `SM_SMOKE_${Date.now()}`

  await twilioPost("/voice/status", {
    CallSid: callSid,
    From: phone,
    CallStatus: "no-answer",
    CallerName: "Smoke Test",
  })
  console.log("✓ /voice/status accepted")

  await sleep(1200)

  await twilioPost("/sms", {
    From: phone,
    To: process.env.TWILIO_PHONE_NUMBER || "+10000000000",
    Body: "Hi, this is a smoke-test lead reply",
    MessageSid: messageSid,
  })
  console.log("✓ /sms accepted")

  await sleep(1200)

  const client = new ConvexHttpClient(convexClientUrl)
  const calls = await client.query(api.calls.list)
  const leads = await client.query(api.leads.listRecent)

  const call = calls.find((c) => c.twilioCallSid === callSid)
  const lead = leads.find((l) => l.twilioMessageSid === messageSid)

  if (!call) throw new Error("Call not found after webhook flow")
  if (!lead) throw new Error("Lead not found after inbound SMS flow")
  if (call.status !== "responded") {
    throw new Error(`Expected call.status=responded, got ${call.status}`)
  }

  console.log("✓ Convex records verified")
  console.log("Smoke test passed")
}

main().catch((err) => {
  console.error("Smoke test failed:", err.message)
  process.exit(1)
})
