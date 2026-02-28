"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CallsFilters() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const hasFilters = search !== "" || status !== "all" || dateRange !== "all"

  function clearFilters() {
    setSearch("")
    setStatus("all")
    setDateRange("all")
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search caller or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="missed">Missed</SelectItem>
          <SelectItem value="responded">Responded</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="month">This month</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
