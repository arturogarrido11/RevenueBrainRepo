"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const MAX_CHARS = 160

export default function SettingsPage() {
  const settings = useQuery(api.settings.get)
  const upsertSettings = useMutation(api.settings.upsert)

  const [businessName, setBusinessName] = useState("My Business")
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi! Sorry we missed your call. Reply here with what you need, or book here: {callback_url}"
  )
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [responseDelaySeconds, setResponseDelaySeconds] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!settings) return
    setBusinessName(settings.businessName)
    setSmsTemplate(settings.smsTemplate)
    setSmsEnabled(settings.smsEnabled)
    setResponseDelaySeconds(settings.responseDelaySeconds)
  }, [settings])

  const responseDelayLabel = useMemo(() => {
    if (responseDelaySeconds === 0) return "Immediately"
    if (responseDelaySeconds < 60) return `${responseDelaySeconds}s`
    return `${Math.round(responseDelaySeconds / 60)}m`
  }, [responseDelaySeconds])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await upsertSettings({
        businessName,
        smsTemplate,
        smsEnabled,
        responseDelaySeconds,
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell title="Settings">
      <div className="flex max-w-3xl flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure auto-response behavior for your business</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium">Enable SMS Auto-Reply</p>
                <p className="text-xs text-muted-foreground">Send a follow-up SMS when a call is missed</p>
              </div>
              <button
                role="switch"
                aria-checked={smsEnabled}
                onClick={() => setSmsEnabled((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${smsEnabled ? "bg-primary" : "bg-input"}`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg transition-transform ${smsEnabled ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="response-delay">Response Delay (seconds)</Label>
              <Input
                id="response-delay"
                type="number"
                min={0}
                value={responseDelaySeconds}
                onChange={(e) => setResponseDelaySeconds(Math.max(0, Number(e.target.value) || 0))}
              />
              <p className="text-xs text-muted-foreground">Current: {responseDelayLabel}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sms-template">SMS Template</Label>
              <Textarea
                id="sms-template"
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={MAX_CHARS}
              />
              <p className="text-xs text-muted-foreground">Variables: {"{business_name}"}, {"{caller_name}"}, {"{callback_url}"} · {smsTemplate.length}/{MAX_CHARS}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={saving || !settings}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved ? <span className="text-xs text-emerald-600">Saved</span> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
