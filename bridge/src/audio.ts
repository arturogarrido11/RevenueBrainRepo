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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MulawCodec } = require("alawmulaw") as {
  MulawCodec: {
    decode: (samples: Uint8Array) => Int16Array
    encode: (samples: Int16Array) => Uint8Array
  }
}

const UPSAMPLE_FACTOR = 2  // 8kHz → 16kHz

/**
 * Decode μ-law 8kHz bytes → PCM 16-bit little-endian at 16kHz.
 * Each input byte produces UPSAMPLE_FACTOR output samples.
 */
export function mulawToPcm16(mulawBuf: Buffer): Buffer {
  // Decode μ-law → 16-bit PCM samples at 8kHz
  const pcm8k = MulawCodec.decode(new Uint8Array(mulawBuf))
  const inCount = pcm8k.length

  // Upsample via linear interpolation
  const outCount = inCount * UPSAMPLE_FACTOR
  const pcm16k = new Int16Array(outCount)

  for (let i = 0; i < inCount; i++) {
    const cur = pcm8k[i]
    const next = i + 1 < inCount ? pcm8k[i + 1] : cur
    for (let f = 0; f < UPSAMPLE_FACTOR; f++) {
      // Linear interpolation between cur and next
      pcm16k[i * UPSAMPLE_FACTOR + f] = Math.round(cur + ((next - cur) * f) / UPSAMPLE_FACTOR)
    }
  }

  return Buffer.from(pcm16k.buffer, pcm16k.byteOffset, pcm16k.byteLength)
}

/**
 * Encode PCM 16-bit little-endian at 16kHz → μ-law 8kHz bytes.
 * Every UPSAMPLE_FACTOR input samples are averaged (downsample) then encoded.
 */
export function pcm16ToMulaw(pcm16Buf: Buffer): Buffer {
  const totalSamples = Math.floor(pcm16Buf.length / 2)
  const inSamples = new Int16Array(
    pcm16Buf.buffer,
    pcm16Buf.byteOffset,
    totalSamples
  )

  // Downsample: average groups of UPSAMPLE_FACTOR samples
  const outCount = Math.floor(totalSamples / UPSAMPLE_FACTOR)
  const downsampled = new Int16Array(outCount)
  for (let i = 0; i < outCount; i++) {
    let sum = 0
    for (let f = 0; f < UPSAMPLE_FACTOR; f++) {
      sum += inSamples[i * UPSAMPLE_FACTOR + f] ?? 0
    }
    downsampled[i] = Math.round(sum / UPSAMPLE_FACTOR)
  }

  // Encode to μ-law
  const encoded = MulawCodec.encode(downsampled)
  return Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength)
}
