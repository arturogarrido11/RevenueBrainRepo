"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"

// Use a safe fallback URL in environments where NEXT_PUBLIC_CONVEX_URL is not
// configured (e.g. local `next build`). For real deployments you should set
// NEXT_PUBLIC_CONVEX_URL to your Convex deployment URL.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://convex.invalid"
const convexClient = new ConvexReactClient(convexUrl)

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>
}
