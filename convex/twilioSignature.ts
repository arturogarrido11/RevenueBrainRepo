"use node"

import { internalAction } from "./_generated/server"
import { v } from "convex/values"
import { createHmac } from "crypto"

export const computeSignature = internalAction({
  args: {
    url: v.string(),
    body: v.string(),
    authToken: v.string(),
  },
  handler: async (_ctx, { url, body, authToken }) => {
    const params = new URLSearchParams(body)
    const sortedKeys = Array.from(params.keys()).sort()

    let dataString = url
    for (const key of sortedKeys) {
      dataString += key + (params.get(key) || "")
    }

    const hmac = createHmac("sha1", authToken)
    hmac.update(dataString)
    return hmac.digest("base64")
  },
})
