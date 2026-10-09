// Shrink photos on the device before upload (IT-2023 › Uploads): phone photos are 3–8 MB,
// a readable ID or document photo at 1600px is ~300 KB. Browser-only.

export async function resizeImage(file: File, maxDimension = 1600, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size < 1_000_000) return file // already small

  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const type = file.type === "image/png" ? "image/png" : "image/jpeg"
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality))
  if (!blob || blob.size >= file.size) return file
  const ext = type === "image/png" ? "png" : "jpg"
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type, lastModified: Date.now() })
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
