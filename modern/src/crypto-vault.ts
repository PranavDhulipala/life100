import { envelopeSchema, type Envelope } from './envelope'
import { vaultSchema, type Vault } from './model'

const encoder = new TextEncoder()
const aad = encoder.encode('life100/encrypted-backup/v1')
const encode = (bytes: Uint8Array) => {
  let s = ''
  for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return btoa(s)
}
const decode = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0))
async function derive(passphrase: string, salt: Uint8Array<ArrayBuffer>) {
  if (passphrase.length < 16) throw Error('Use a unique backup passphrase of at least 16 characters.')
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({name:'PBKDF2', hash:'SHA-256', salt, iterations:600000}, material, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt'])
}
export async function encryptVault(vault: Vault, passphrase: string): Promise<Envelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await derive(passphrase, salt)
  const plaintext = encoder.encode(JSON.stringify(vaultSchema.parse(vault)))
  if (plaintext.length > 740000) throw Error('Workspace exceeds current encrypted snapshot limit; export locally.')
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM', iv, additionalData:aad}, key, plaintext)
  return envelopeSchema.parse({version:1, algorithm:'AES-256-GCM', kdf:'PBKDF2-SHA256', iterations:600000, salt:encode(salt), iv:encode(iv), ciphertext:encode(new Uint8Array(ciphertext))})
}
export async function decryptVault(value: unknown, passphrase: string): Promise<Vault> {
  const e = envelopeSchema.parse(value)
  const salt = decode(e.salt), iv = decode(e.iv)
  if (salt.length !== 16 || iv.length !== 12) throw Error('Invalid backup parameters.')
  const key = await derive(passphrase, salt)
  let result: ArrayBuffer
  try { result = await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad},key,decode(e.ciphertext)) }
  catch { throw Error('Cannot unlock backup: incorrect passphrase or damaged data.') }
  return vaultSchema.parse(JSON.parse(new TextDecoder().decode(result)))
}
