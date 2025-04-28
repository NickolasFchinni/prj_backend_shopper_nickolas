import path from "path"

export function buildImageUrl(imagePath: string): string {
  const fileName = path.basename(imagePath)
  const BASE_URL = process.env.BASE_URL || "http://localhost"
  return `${BASE_URL}/uploads/${fileName}`
}
