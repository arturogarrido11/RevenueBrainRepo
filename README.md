# Revenue Brain MVP

Missed-call follow-up SaaS for small businesses:

1. Customer calls your Twilio number
2. If call outcome is missed (`no-answer`, `busy`, `failed`), app auto-sends SMS follow-up
3. Customer replies by SMS
4. Reply is logged as a lead in Convex

## Stack

- Next.js 16 (UI)
- Convex (database, mutations/queries, HTTP webhook endpoints)
- Twilio (voice + SMS)

## Environment variables

Copy `.env.example` to your local env setup (Convex + app):

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `BASE_URL` (used for booking link in SMS template as `{callback_url}`)
- `TWILIO_WEBHOOK_SECRET` (optional; defaults to `TWILIO_AUTH_TOKEN` for signature validation)

## Local development

```bash
npm install
npm run dev
```

Run Convex dev in another terminal (if not already configured):

```bash
npx convex dev
```

UI runs on `http://localhost:3000`.

## Webhook endpoints

Defined in `convex/http.ts`:

- `POST /voice/status` — Twilio Voice status callback (detects missed calls)
- `POST /sms` — Twilio inbound message webhook (captures reply + logs lead)
- `GET /health` — health check

Convex deployment URL format:

`https://<your-deployment>.convex.site`

So endpoints are:

- `https://<your-deployment>.convex.site/voice/status`
- `https://<your-deployment>.convex.site/sms`
- `https://<your-deployment>.convex.site/health`

## Twilio Console setup (exact)

### Phone Number → Voice

- **A call comes in**: (you can point to your voice flow/TwiML as needed)
- **Status callback URL**: `https://<your-deployment>.convex.site/voice/status`
- **Status callback events**: include at least `completed` (Twilio sends final `CallStatus` values such as `no-answer`, `busy`, `failed`)
- **HTTP method**: `POST`

### Phone Number → Messaging

- **A message comes in**: `https://<your-deployment>.convex.site/sms`
- **HTTP method**: `POST`

## ngrok testing (local)

If you want to test local webhook handling outside deployed Convex:

```bash
ngrok http 3210
```

Then point Twilio webhook URLs to your ngrok URL + paths. If you test against deployed Convex, ngrok is not required.

## What gets stored

### Calls (`calls` table)

- Twilio call SID
- Caller phone number
- Timestamp
- Status (`missed` / `responded` / `pending`)
- SMS sent flag/body
- Response channel/time when caller replies

### Leads (`leads` table)

- `fromPhoneNumber`
- `messageBody`
- `timestamp`
- optional `businessId`
- optional `twilioMessageSid`

### SMS compliance behavior

- Inbound STOP keywords (`STOP`, `STOPALL`, `UNSUBSCRIBE`, `CANCEL`, `END`, `QUIT`) mark the contact as opted-out.
- Opted-out contacts are automatically skipped for future outbound auto-SMS sends.

## Logging

Webhook and SMS events emit structured JSON logs with event names, status, and error details.

## Deployment (Railway / Render)

1. Connect GitHub repo in Railway or Render
2. Set environment variables from `.env.example`
3. Deploy web app + Convex backend
4. Confirm `/health` returns 200 JSON
5. Update Twilio webhook URLs to deployed Convex URL
6. Place a test call and verify:
   - missed call triggers outbound SMS
   - inbound SMS reply inserts a lead record

## Automated smoke test

After deploying Convex + webhooks, run:

```bash
npm run smoke:webhooks
```

Required env:

- `NEXT_PUBLIC_CONVEX_URL` (or `CONVEX_URL`) pointing to your Convex site URL
- `TWILIO_WEBHOOK_SECRET` (or `TWILIO_AUTH_TOKEN`) if signature validation is enabled
- optional `TWILIO_PHONE_NUMBER` for realistic inbound `To` value

What it validates:

1. `GET /health` responds
2. `POST /voice/status` accepted for missed call
3. `POST /sms` accepted for inbound message
4. Convex records include the call + lead and call status becomes `responded`

## Security notes

- Never commit real secrets
- Twilio request signature validation is enabled when `TWILIO_WEBHOOK_SECRET` (or `TWILIO_AUTH_TOKEN`) is set
