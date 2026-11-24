import { z } from 'zod'

// Versioned format; the gateway validates framing but never receives a passphrase.
const b64 = z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/)
export const envelopeSchema = z.object({
  version: z.literal(1),
  algorithm: z.literal('AES-256-GCM'),
  kdf: z.literal('PBKDF2-SHA256'),
  iterations: z.literal(600000),
  salt: b64.length(24),
  iv: b64.length(16),
  ciphertext: b64.min(24).max(1000000),
}).strict()
export type Envelope = z.infer<typeof envelopeSchema>
