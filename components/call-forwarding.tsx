"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Info } from "lucide-react"

interface CallForwardingInstructionsProps {
  number: string
  /** If true, renders as a compact card suitable for the dashboard */
  compact?: boolean
}

function formatNumber(number: string): string {
  // Format E.164 like +1 (305) 555-0100 for display
  const digits = number.replace(/\D/g, "")
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return number
}

export function CallForwardingInstructions({ number, compact = false }: CallForwardingInstructionsProps) {
  const formatted = formatNumber(number)

  const steps = {
    iphone: [
      "Open **Settings** on your iPhone",
      "Scroll down and tap **Phone**",
      "Tap **Call Forwarding**",
      "Toggle **Call Forwarding** on",
      `Enter your AI number: **${formatted}**`,
      "Tap back — forwarding is now active",
    ],
    android: [
      "Open the **Phone** app",
      "Tap the three-dot menu (⋮) → **Settings**",
      "Tap **Supplementary services** (or **Calls**)",
      "Tap **Call forwarding** → **Always forward**",
      `Enter your AI number: **${formatted}**`,
      "Tap **Enable** — forwarding is active",
    ],
    landline: [
      `Dial **\\*72${number}** and press **Call/Send**`,
      "Wait for a confirmation tone or message",
      "Hang up — your calls now forward to your AI",
      "",
      "**To cancel forwarding:** Dial **\\*73** and press Call",
      "**VoIP systems:** Check your admin portal for call forwarding settings",
    ],
  }

  const renderSteps = (items: string[]) => (
    <ol className="space-y-2.5">
      {items.filter(Boolean).map((step, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium mt-0.5">
            {i + 1}
          </span>
          <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
        </li>
      ))}
    </ol>
  )

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Call Forwarding Setup</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Forward your existing number to your AI:{" "}
            <span className="font-mono font-semibold text-foreground">{formatted}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iphone">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="iphone" className="text-xs">iPhone</TabsTrigger>
              <TabsTrigger value="android" className="text-xs">Android</TabsTrigger>
              <TabsTrigger value="landline" className="text-xs">Landline</TabsTrigger>
            </TabsList>
            <TabsContent value="iphone" className="mt-3">{renderSteps(steps.iphone)}</TabsContent>
            <TabsContent value="android" className="mt-3">{renderSteps(steps.android)}</TabsContent>
            <TabsContent value="landline" className="mt-3">{renderSteps(steps.landline)}</TabsContent>
          </Tabs>
          <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 p-3 flex gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Test your setup:</strong>{" "}
              Call <span className="font-mono font-semibold">{formatted}</span> from any phone to hear your AI receptionist.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 flex gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Forward your calls to your AI number</p>
          <p className="text-sm text-muted-foreground">
            To activate your AI receptionist, forward your existing business number to:{" "}
            <span className="font-mono font-semibold text-foreground">{formatted}</span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="iphone">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="iphone">📱 iPhone</TabsTrigger>
          <TabsTrigger value="android">🤖 Android</TabsTrigger>
          <TabsTrigger value="landline">☎️ Landline / VoIP</TabsTrigger>
        </TabsList>
        <TabsContent value="iphone" className="mt-4">
          <div className="rounded-lg border p-4">{renderSteps(steps.iphone)}</div>
        </TabsContent>
        <TabsContent value="android" className="mt-4">
          <div className="rounded-lg border p-4">{renderSteps(steps.android)}</div>
        </TabsContent>
        <TabsContent value="landline" className="mt-4">
          <div className="rounded-lg border p-4">{renderSteps(steps.landline)}</div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex gap-3">
        <span className="text-lg">📞</span>
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Test your setup</p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
            Call <span className="font-mono font-semibold">{formatted}</span> from any phone to hear your AI receptionist in action.
          </p>
        </div>
      </div>
    </div>
  )
}
