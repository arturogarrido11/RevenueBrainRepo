import { AppShell } from "@/components/layout/app-shell"
import { SmsTemplateForm } from "@/components/settings/sms-template-form"
import { EmailTemplateForm } from "@/components/settings/email-template-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="flex flex-col gap-6 max-w-3xl">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Configure auto-response behavior for your business</p>
        </div>

        {/* General settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="My Business" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="business-phone">Business Phone</Label>
                <Input id="business-phone" defaultValue="(555) 000-0001" type="tel" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="response-delay">Response Delay</Label>
              <Select defaultValue="immediate">
                <SelectTrigger id="response-delay" className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="1m">After 1 minute</SelectItem>
                  <SelectItem value="5m">After 5 minutes</SelectItem>
                  <SelectItem value="15m">After 15 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How long to wait before sending an auto-reply</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium">Business Hours Only</p>
                <p className="text-xs text-muted-foreground">Only send auto-replies during business hours</p>
              </div>
              <button
                role="switch"
                aria-checked={false}
                className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg transition-transform translate-x-0" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* SMS template */}
        <SmsTemplateForm />

        {/* Email template */}
        <EmailTemplateForm />
      </div>
    </AppShell>
  )
}
