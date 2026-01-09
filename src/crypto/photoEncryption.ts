/* =======================
   Types
======================= */

export interface EncryptedPhoto {
  encryptedBlob: Blob
  wrappedPhotoKey?: string
  wrappedProcessKey?: string
}

/* =======================
   Main Encrypt Function
======================= */

export async function encryptPhotoIfNeeded(
  file: Blob,
  albumPublicKey?: string,
  pythonPublicKey?: string
): Promise<EncryptedPhoto> {
  // Passthrough if no encryption required
  if (!albumPublicKey && !pythonPublicKey) {
    return { encryptedBlob: file }
  }

  // Read photo into ArrayBuffer
  const buffer = await file.arrayBuffer()

  // Generate AES-256-GCM key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  )

  // Generate IV (12 bytes recommended for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt photo
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    buffer
  )

  // Prepend IV to ciphertext
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.byteLength)

  return {
    encryptedBlob: new Blob([combined]),
    wrappedPhotoKey: albumPublicKey
      ? await wrapKey(aesKey, albumPublicKey)
      : undefined,
    wrappedProcessKey: pythonPublicKey
      ? await wrapKey(aesKey, pythonPublicKey)
      : undefined,
  }
}

/* =======================
   RSA Key Wrapper
======================= */

async function wrapKey(
  aesKey: CryptoKey,
  pemPublicKey: string
): Promise<string> {
  // Export AES key as raw bytes
  const rawKey = await crypto.subtle.exportKey("raw", aesKey)

  if (!pemPublicKey || typeof pemPublicKey !== "string") {
    throw new Error("Public key missing or invalid")
  }

  // Explicitly reject PKCS#1 (WebCrypto does NOT support it)
  if (/BEGIN RSA PUBLIC KEY/.test(pemPublicKey)) {
    throw new Error(
      "Invalid public key format. WebCrypto requires SPKI (BEGIN PUBLIC KEY)."
    )
  }

  // Strip PEM armor and non-base64 characters
  let base64 = pemPublicKey
    .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "")
    .replace(/[^A-Za-z0-9+/=]/g, "")
    .trim()

  if (!base64) {
    throw new Error("Public key base64 content is empty")
  }

  // Fix missing padding
  while (base64.length % 4 !== 0) {
    base64 += "="
  }

  // Decode base64 safely
  let binaryKey: Uint8Array
  try {
    binaryKey = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  } catch {
    throw new Error("Public key is not valid base64")
  }

  // IMPORTANT:
  // Force a real ArrayBuffer (NOT SharedArrayBuffer)
  const spkiArrayBuffer = binaryKey.slice().buffer as ArrayBuffer

  // Import RSA public key
  const publicKey = await crypto.subtle.importKey(
    "spki",
    spkiArrayBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  )

  // Wrap (encrypt) AES key using RSA-OAEP
  const wrappedKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  )

  // Return base64-encoded wrapped key
  return btoa(String.fromCharCode(...new Uint8Array(wrappedKey)))
}
