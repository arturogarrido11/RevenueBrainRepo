/**
 * Audio transcoding utilities for the Twilio ↔ OpenAI bridge.
 *
 * Twilio Media Streams sends μ-law (G.711 μ-law) 8kHz 8-bit audio.
 * OpenAI Realtime API (pcm16 format) expects 16-bit PCM at 16kHz.
 *
 * Codec: `alawmulaw` npm package (MulawCodec).
 * Resampling: simple linear interpolation (8kHz ↔ 16kHz, factor = 2).
 *
 * Note: OpenAI's `pcm16` format is technically 24kHz; if audio sounds
 * sped-up or slow, change UPSAMPLE_FACTOR to 3. The value of 2 matches
 * the spec's stated "16kHz" target.
 */
/**
 * Decode μ-law 8kHz bytes → PCM 16-bit little-endian at 16kHz.
 * Each input byte produces UPSAMPLE_FACTOR output samples.
 */
export declare function mulawToPcm16(mulawBuf: Buffer): Buffer;
/**
 * Encode PCM 16-bit little-endian at 16kHz → μ-law 8kHz bytes.
 * Every UPSAMPLE_FACTOR input samples are averaged (downsample) then encoded.
 */
export declare function pcm16ToMulaw(pcm16Buf: Buffer): Buffer;
//# sourceMappingURL=audio.d.ts.map