export type CallStatus = "missed" | "responded" | "pending"
export type ResponseChannel = "sms" | "email" | "none"
export type ContactStatus = "new" | "active" | "lapsed"

export interface MissedCall {
  id: string
  callerId: string
  callerName: string | null
  phoneNumber: string
  timestamp: Date
  duration: number // seconds, 0 for missed
  status: CallStatus
  responseChannel: ResponseChannel
  responseTime: number | null // seconds after call
}

export interface Contact {
  id: string
  name: string | null
  phoneNumber: string
  email: string | null
  totalCalls: number
  lastCalledAt: Date
  lastResponseChannel: ResponseChannel | null
  responseRate: number // 0–1
  status: ContactStatus
}

export const DASHBOARD_STATS = {
  missedToday: 12,
  missedYesterday: 9,
  responseRate: 0.87,
  responseRatePrev: 0.82,
  avgResponseTimeSeconds: 222,
  avgResponseTimePrevSeconds: 234,
  totalContacts: 284,
  newContactsThisWeek: 18,
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

export const MOCK_CALLS: MissedCall[] = [
  {
    id: "call_01",
    callerId: "contact_01",
    callerName: "Sarah Johnson",
    phoneNumber: "(555) 234-5678",
    timestamp: minsAgo(4),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_02",
    callerId: "contact_02",
    callerName: "Marcus Williams",
    phoneNumber: "(555) 345-6789",
    timestamp: minsAgo(18),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 120,
  },
  {
    id: "call_03",
    callerId: "contact_03",
    callerName: null,
    phoneNumber: "(555) 456-7890",
    timestamp: minsAgo(45),
    duration: 0,
    status: "pending",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_04",
    callerId: "contact_04",
    callerName: "Elena Martinez",
    phoneNumber: "(555) 567-8901",
    timestamp: hoursAgo(1),
    duration: 0,
    status: "responded",
    responseChannel: "email",
    responseTime: 480,
  },
  {
    id: "call_05",
    callerId: "contact_05",
    callerName: "David Chen",
    phoneNumber: "(555) 678-9012",
    timestamp: hoursAgo(2),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_06",
    callerId: "contact_06",
    callerName: "Amanda Torres",
    phoneNumber: "(555) 789-0123",
    timestamp: hoursAgo(3),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 95,
  },
  {
    id: "call_07",
    callerId: "contact_07",
    callerName: "James Patel",
    phoneNumber: "(555) 890-1234",
    timestamp: hoursAgo(4),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 210,
  },
  {
    id: "call_08",
    callerId: "contact_08",
    callerName: null,
    phoneNumber: "(555) 901-2345",
    timestamp: hoursAgo(5),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_09",
    callerId: "contact_09",
    callerName: "Rachel Kim",
    phoneNumber: "(555) 012-3456",
    timestamp: hoursAgo(6),
    duration: 0,
    status: "responded",
    responseChannel: "email",
    responseTime: 330,
  },
  {
    id: "call_10",
    callerId: "contact_10",
    callerName: "Tom Rivera",
    phoneNumber: "(555) 123-4567",
    timestamp: hoursAgo(8),
    duration: 0,
    status: "pending",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_11",
    callerId: "contact_01",
    callerName: "Sarah Johnson",
    phoneNumber: "(555) 234-5678",
    timestamp: daysAgo(1),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 180,
  },
  {
    id: "call_12",
    callerId: "contact_11",
    callerName: "Lisa Nguyen",
    phoneNumber: "(555) 321-0987",
    timestamp: daysAgo(1),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_13",
    callerId: "contact_12",
    callerName: "Brandon Scott",
    phoneNumber: "(555) 432-1098",
    timestamp: daysAgo(1),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 60,
  },
  {
    id: "call_14",
    callerId: "contact_13",
    callerName: null,
    phoneNumber: "(555) 543-2109",
    timestamp: daysAgo(2),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_15",
    callerId: "contact_02",
    callerName: "Marcus Williams",
    phoneNumber: "(555) 345-6789",
    timestamp: daysAgo(2),
    duration: 0,
    status: "responded",
    responseChannel: "email",
    responseTime: 720,
  },
  {
    id: "call_16",
    callerId: "contact_14",
    callerName: "Priya Sharma",
    phoneNumber: "(555) 654-3210",
    timestamp: daysAgo(3),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 145,
  },
  {
    id: "call_17",
    callerId: "contact_15",
    callerName: "Kevin O'Brien",
    phoneNumber: "(555) 765-4321",
    timestamp: daysAgo(4),
    duration: 0,
    status: "missed",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_18",
    callerId: "contact_05",
    callerName: "David Chen",
    phoneNumber: "(555) 678-9012",
    timestamp: daysAgo(5),
    duration: 0,
    status: "responded",
    responseChannel: "sms",
    responseTime: 90,
  },
  {
    id: "call_19",
    callerId: "contact_08",
    callerName: null,
    phoneNumber: "(555) 901-2345",
    timestamp: daysAgo(6),
    duration: 0,
    status: "pending",
    responseChannel: "none",
    responseTime: null,
  },
  {
    id: "call_20",
    callerId: "contact_04",
    callerName: "Elena Martinez",
    phoneNumber: "(555) 567-8901",
    timestamp: daysAgo(7),
    duration: 0,
    status: "responded",
    responseChannel: "email",
    responseTime: 300,
  },
]

export const MOCK_CONTACTS: Contact[] = [
  {
    id: "contact_01",
    name: "Sarah Johnson",
    phoneNumber: "(555) 234-5678",
    email: "sarah.j@email.com",
    totalCalls: 3,
    lastCalledAt: minsAgo(4),
    lastResponseChannel: "sms",
    responseRate: 0.67,
    status: "active",
  },
  {
    id: "contact_02",
    name: "Marcus Williams",
    phoneNumber: "(555) 345-6789",
    email: "mwilliams@email.com",
    totalCalls: 2,
    lastCalledAt: minsAgo(18),
    lastResponseChannel: "sms",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_03",
    name: null,
    phoneNumber: "(555) 456-7890",
    email: null,
    totalCalls: 1,
    lastCalledAt: minsAgo(45),
    lastResponseChannel: null,
    responseRate: 0,
    status: "new",
  },
  {
    id: "contact_04",
    name: "Elena Martinez",
    phoneNumber: "(555) 567-8901",
    email: "elena.m@email.com",
    totalCalls: 2,
    lastCalledAt: hoursAgo(1),
    lastResponseChannel: "email",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_05",
    name: "David Chen",
    phoneNumber: "(555) 678-9012",
    email: null,
    totalCalls: 2,
    lastCalledAt: hoursAgo(2),
    lastResponseChannel: "sms",
    responseRate: 0.5,
    status: "active",
  },
  {
    id: "contact_06",
    name: "Amanda Torres",
    phoneNumber: "(555) 789-0123",
    email: "atorres@email.com",
    totalCalls: 1,
    lastCalledAt: hoursAgo(3),
    lastResponseChannel: "sms",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_07",
    name: "James Patel",
    phoneNumber: "(555) 890-1234",
    email: "jpatel@email.com",
    totalCalls: 1,
    lastCalledAt: hoursAgo(4),
    lastResponseChannel: "sms",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_08",
    name: null,
    phoneNumber: "(555) 901-2345",
    email: null,
    totalCalls: 2,
    lastCalledAt: hoursAgo(5),
    lastResponseChannel: null,
    responseRate: 0,
    status: "new",
  },
  {
    id: "contact_09",
    name: "Rachel Kim",
    phoneNumber: "(555) 012-3456",
    email: "rachel.kim@email.com",
    totalCalls: 1,
    lastCalledAt: hoursAgo(6),
    lastResponseChannel: "email",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_10",
    name: "Tom Rivera",
    phoneNumber: "(555) 123-4567",
    email: null,
    totalCalls: 1,
    lastCalledAt: hoursAgo(8),
    lastResponseChannel: null,
    responseRate: 0,
    status: "new",
  },
  {
    id: "contact_11",
    name: "Lisa Nguyen",
    phoneNumber: "(555) 321-0987",
    email: "lnguyen@email.com",
    totalCalls: 4,
    lastCalledAt: daysAgo(35),
    lastResponseChannel: null,
    responseRate: 0.25,
    status: "lapsed",
  },
  {
    id: "contact_12",
    name: "Brandon Scott",
    phoneNumber: "(555) 432-1098",
    email: null,
    totalCalls: 1,
    lastCalledAt: daysAgo(1),
    lastResponseChannel: "sms",
    responseRate: 1.0,
    status: "active",
  },
  {
    id: "contact_13",
    name: null,
    phoneNumber: "(555) 543-2109",
    email: null,
    totalCalls: 1,
    lastCalledAt: daysAgo(2),
    lastResponseChannel: null,
    responseRate: 0,
    status: "new",
  },
  {
    id: "contact_14",
    name: "Priya Sharma",
    phoneNumber: "(555) 654-3210",
    email: "priya.s@email.com",
    totalCalls: 3,
    lastCalledAt: daysAgo(45),
    lastResponseChannel: "sms",
    responseRate: 0.33,
    status: "lapsed",
  },
  {
    id: "contact_15",
    name: "Kevin O'Brien",
    phoneNumber: "(555) 765-4321",
    email: "kobrien@email.com",
    totalCalls: 2,
    lastCalledAt: daysAgo(4),
    lastResponseChannel: null,
    responseRate: 0,
    status: "active",
  },
]

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "yesterday"
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function formatResponseTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
