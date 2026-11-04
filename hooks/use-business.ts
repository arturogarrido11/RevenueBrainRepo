"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

/**
 * Returns the authenticated user's business row (or null/undefined while loading).
 *
 * Usage:
 * ```ts
 * const { business, isLoading } = useBusiness()
 * ```
 */
export function useBusiness() {
  const business = useQuery(api.businesses.getMyBusiness)
  return {
    business: business ?? null,
    isLoading: business === undefined,
  }
}
