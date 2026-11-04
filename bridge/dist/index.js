/**
 * Revenue Brain Bridge — Fastify WebSocket server
 *
 * Exposes:
 *   GET /media-stream  — Twilio Media Streams WebSocket endpoint
 *   GET /health        — Health check for Railway/load balancer
 *
 * Twilio opens the WebSocket with query params:
 *   ?callSid={CallSid}&from={From}&to={To}
 */
import Fastify from "fastify";
import fastifyWebSocket from "@fastify/websocket";
import { handleSession } from "./session.js";
const server = Fastify({
    logger: {
        level: "info",
        serializers: {
            req(req) {
                return { method: req.method, url: req.url };
            },
        },
    },
});
// Register WebSocket plugin
await server.register(fastifyWebSocket, {
    options: { perMessageDeflate: false },
});
// ─────────────────────────────────────────────────────────────────────────────
// GET /health — Health check
// ─────────────────────────────────────────────────────────────────────────────
server.get("/health", async () => {
    return { status: "ok", uptime: process.uptime(), ts: new Date().toISOString() };
});
// ─────────────────────────────────────────────────────────────────────────────
// GET /media-stream — Twilio Media Streams WebSocket
// Twilio connects here when a <Stream url="wss://..."> TwiML verb is executed.
// ─────────────────────────────────────────────────────────────────────────────
server.get("/media-stream", { websocket: true }, (socket, req) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const callSid = url.searchParams.get("callSid") ?? "";
    const fromNumber = url.searchParams.get("from") ?? "";
    const toNumber = url.searchParams.get("to") ?? "";
    console.log(JSON.stringify({
        event: "bridge.ws_connect",
        callSid,
        fromNumber,
        toNumber,
        remoteAddress: req.socket.remoteAddress,
    }));
    // callSid may be empty here — Twilio does not pass query params in the
    // WebSocket URL. The real callSid arrives in Twilio's "start" message.
    // handleSession reads it from there and updates state.
    if (!callSid) {
        console.log(JSON.stringify({ event: "bridge.callsid_from_start_message" }));
    }
    // Delegate to session handler — it manages its own lifecycle
    handleSession(socket, callSid, fromNumber, toNumber).catch((err) => {
        console.error(JSON.stringify({ event: "bridge.session_error", callSid, error: String(err) }));
        socket.close();
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────────────────────────
const port = parseInt(process.env.PORT ?? "3001", 10);
const host = process.env.HOST ?? "0.0.0.0";
try {
    await server.listen({ port, host });
    console.log(JSON.stringify({ event: "bridge.started", port, host }));
}
catch (err) {
    console.error(JSON.stringify({ event: "bridge.start_failed", error: String(err) }));
    process.exit(1);
}
//# sourceMappingURL=index.js.map