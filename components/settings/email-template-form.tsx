"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const DEFAULT_SUBJECT = "We missed your call — {business_name}"
const DEFAULT_BODY = `Hi {caller_name},

Thank you for reaching out to {business_name}. We're sorry we missed your call!

We'll get back to you as soon as possible. If you'd like to schedule a callback, you can use this link: {callback_url}

Best regards,
The {business_name} Team`

const VARIABLES = ["{caller_name}", "{business_name}", "{callback_url}"]

export function EmailTemplateForm() {
  const [enabled, setEnabled] = useState(false)
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [body, setBody] = useState(DEFAULT_BODY)

  function insertVariable(variable: string) {
    setBody((prev) => prev + variable)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Auto-Reply</CardTitle>
        <CardDescription>Sent to callers who have an email on file</CardDescription>
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
          <Label className="text-sm">Enable email auto-reply</Label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email-subject">Subject Line</Label>
          <Input
            id="email-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            disabled={!enabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email-body">Email Body</Label>
          <Textarea
            id="email-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your email message..."
            className="min-h-[160px] resize-none"
            disabled={!enabled}
          />
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
        </div>
      </CardContent>
      <CardFooter className="border-t gap-2">
        <Button disabled={!enabled}>Save Changes</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setSubject(DEFAULT_SUBJECT)
            setBody(DEFAULT_BODY)
          }}
          disabled={!enabled}
        >
          Preview Email
        </Button>
      </CardFooter>
    </Card>
  )
}
