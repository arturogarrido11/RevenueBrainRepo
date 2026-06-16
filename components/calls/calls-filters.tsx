"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CallsFiltersProps {
  search: string
  status: string
  dateRange: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onDateRangeChange: (v: string) => void
}

export function CallsFilters({ search, status, dateRange, onSearchChange, onStatusChange, onDateRangeChange }: CallsFiltersProps) {
  const hasFilters = search !== "" || status !== "all" || dateRange !== "all"
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search caller or number..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-8" />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="missed">Missed</SelectItem>
          <SelectItem value="responded">Responded</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="ai_recorded">AI Recorded</SelectItem>
        </SelectContent>
      </Select>
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-36"><SelectValue placeholder="Date range" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="month">This month</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && <Button variant="ghost" size="sm" onClick={() => { onSearchChange(""); onStatusChange("all"); onDateRangeChange("all") }}><X className="size-3.5" />Clear</Button>}
    </div>
  )
}
