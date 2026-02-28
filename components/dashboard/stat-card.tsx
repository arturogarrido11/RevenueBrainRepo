import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down"
    positive: boolean
  }
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <CardAction>
          <div className="rounded-md bg-muted p-1.5">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-destructive"
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
