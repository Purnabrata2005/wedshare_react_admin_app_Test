export interface EncryptedPhoto {
  encryptedBlob: Blob
  wrappedPhotoKey: string
  wrappedProcessKey: string
}

export async function encryptPhotoOrFail(
  file: Blob,
  albumPublicKey: string,
  processPublicKey: string
): Promise<EncryptedPhoto> {
  if (!albumPublicKey || !processPublicKey) {
    throw new Error("Encryption keys missing")
  }

  const buffer = await file.arrayBuffer()

  const photoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    photoKey,
    buffer
  )

  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.byteLength)

  return {
    encryptedBlob: new Blob([combined]),
    wrappedPhotoKey: btoa("photo-key-placeholder"),
    wrappedProcessKey: btoa("process-key-placeholder"),
  }
}
