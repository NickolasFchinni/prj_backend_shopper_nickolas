import fs from "fs"
import { ERRORS } from "../constants/errors.constant"

export async function readImageAsBase64(imagePath: string): Promise<string> {
  if (!fs.existsSync(imagePath)) {
    throw new Error(ERRORS.IMAGE_NOT_FOUND)
  }
  return await fs.promises.readFile(imagePath, { encoding: "base64" })
}
