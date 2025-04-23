import { Request, Response } from "express"
import { uploadImageAndExtractValue } from "../services/upload.service"

export async function handleUpload(req: Request, res: Response): Promise<void> {
  try {
    const result = await uploadImageAndExtractValue(req.body)
    res.status(200).json(result) // Sem return
  } catch (error: any) {
    if (error.code === "DOUBLE_REPORT") {
      res.status(409).json({
        error_code: error.code,
        error_description: error.message,
      })
    } else {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: error.message,
      })
    }
  }
}
