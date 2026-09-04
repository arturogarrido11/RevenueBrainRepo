# Revenue Brain Bridge

WebSocket bridge microservice that connects Twilio Media Streams to the OpenAI Realtime API, enabling live AI voice conversations for the Revenue Brain AI Voice Receptionist feature.

## Architecture

```
Caller → Twilio → [WebSocket] → Bridge → [WebSocket] → OpenAI Realtime API
                     μ-law 8kHz          PCM 16kHz
```

## What it does

1. Receives Twilio Media Streams WebSocket connections at `GET /media-stream`
2. Opens an OpenAI Realtime API session per call
3. Transcodes audio: Twilio μ-law 8kHz ↔ OpenAI PCM 16kHz
4. Handles AI tool calls (`capture_lead`, `end_call`, `transfer_call`, `check_availability`, `book_appointment`)
5. Posts session summary to Convex `/voice/session-end` when call ends

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

Required variables:
- `OPENAI_API_KEY` — OpenAI API key with Realtime API access
- `TWILIO_ACCOUNT_SID` — Twilio account SID
- `TWILIO_AUTH_TOKEN` — Twilio auth token
- `TWILIO_PHONE_NUMBER` — Your Twilio phone number in E.164 format
- `CONVEX_SITE_URL` — Your Convex HTTP actions URL (from Convex dashboard)
- `BRIDGE_SECRET` — Shared secret for Convex `/voice/session-end` auth (generate: `openssl rand -hex 32`)

### 3. Build

```bash
npm run build
```

### 4. Run locally (for testing with ngrok)

```bash
npm start
# In another terminal:
ngrok http 3001
```

Use the ngrok HTTPS URL as the `BRIDGE_WSS_URL` Convex environment variable:
- Format: `wss://your-ngrok-id.ngrok.io/media-stream`

## Deploy to Railway

### Initial setup

1. Create a new Railway project
2. Connect this directory (or the GitHub repo)
3. Set all environment variables in Railway's dashboard
4. Railway auto-deploys on push

### Environment variables to set in Railway

All variables from `.env.example` except `PORT` and `HOST` (Railway sets those automatically).

After deploy, set the Railway public URL as `BRIDGE_WSS_URL` in your Convex environment:
```
wss://your-service.railway.app/media-stream
```

Also set `BRIDGE_WSS_URL` in Convex dashboard (Settings → Environment Variables).

### Verify deployment

```bash
curl https://your-service.railway.app/health
# → {"status":"ok","uptime":...}
```

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `TWILIO_ACCOUNT_SID` | ✅ | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | ✅ | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | ✅ | Twilio phone number (E.164) |
| `CONVEX_SITE_URL` | ✅ | Convex site URL |
| `BRIDGE_SECRET` | ✅ | Shared secret for session-end auth |
| `PORT` | ❌ | Server port (default: 3001) |
| `HOST` | ❌ | Server host (default: 0.0.0.0) |
| `MAX_CALL_DURATION_SEC` | ❌ | Max call duration in seconds (default: 300) |

## Twilio configuration

After deploying, configure your Twilio number:
1. **Voice webhook**: `POST https://your-convex.convex.site/voice`
2. **Status callback**: `POST https://your-convex.convex.site/voice/status`

The `/voice` Convex action reads `BRIDGE_WSS_URL` to generate the `<Stream>` TwiML.
Set `BRIDGE_WSS_URL` in Convex environment variables.
