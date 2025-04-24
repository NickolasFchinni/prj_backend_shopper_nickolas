import { Request, Response } from "express"
import { uploadImageAndExtractValue } from "../services/upload.service"
import { ApiError } from "../errors/apiError.error"
import { handleError } from "../utils/handleError.util"

export async function handleUpload(req: Request, res: Response): Promise<void> {
  try {
    const imageFile = req.file
    const { customer_code, measure_datetime, measure_type } = req.body

    if (!imageFile) {
      throw new ApiError("Imagem não enviada", "IMAGE_MISSING", 400)
    }

    const result = await uploadImageAndExtractValue({
      imagePath: imageFile.path,
      customer_code,
      measure_datetime,
      measure_type,
    })

    res.status(200).json(result)
  } catch (error: any) {
    handleError(res, error)
  }
}
