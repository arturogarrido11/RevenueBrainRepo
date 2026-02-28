"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const DEFAULT_TEMPLATE = "Hi {caller_name}, sorry we missed your call at {business_name}! We'll get back to you shortly. Reply STOP to opt out."
const MAX_CHARS = 160

const VARIABLES = ["{caller_name}", "{business_name}", "{callback_url}"]

export function SmsTemplateForm() {
  const [enabled, setEnabled] = useState(true)
  const [message, setMessage] = useState(DEFAULT_TEMPLATE)

  function insertVariable(variable: string) {
    setMessage((prev) => prev + variable)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Auto-Reply</CardTitle>
        <CardDescription>Sent automatically when a call is missed</CardDescription>
        <CardAction>
          <Badge variant={enabled ? "default" : "outline"}>
            {enabled ? "Active" : "Inactive"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              enabled ? "bg-primary" : "bg-input"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <Label className="text-sm">Enable SMS auto-reply</Label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sms-message">Message Template</Label>
          <Textarea
            id="sms-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your SMS message..."
            className="min-h-[100px] resize-none"
            maxLength={MAX_CHARS}
            disabled={!enabled}
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVariable(v)}
                  disabled={!enabled}
                  className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {v}
                </button>
              ))}
            </div>
            <span className={`text-xs ${message.length >= MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}>
              {message.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t gap-2">
        <Button disabled={!enabled}>Save Changes</Button>
        <Button
          variant="ghost"
          onClick={() => setMessage(DEFAULT_TEMPLATE)}
          disabled={!enabled}
        >
          Reset to Default
        </Button>
      </CardFooter>
    </Card>
  )
}
