import { Request, Response } from "express"
import { uploadImageAndExtractValue } from "../services/upload.service"

export async function handleUpload(req: Request, res: Response): Promise<void> {
  try {
    const imageFile = req.file
    const { customer_code, measure_datetime, measure_type } = req.body

    if (!imageFile) {
      throw new Error("Imagem não enviada")
    }

    const result = await uploadImageAndExtractValue({
      imagePath: imageFile.path, // <-- aqui mudou
      customer_code,
      measure_datetime,
      measure_type,
    })

    res.status(200).json(result)
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
