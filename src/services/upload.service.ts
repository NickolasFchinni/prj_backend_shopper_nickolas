import { MeasureType } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { getMeasureValueFromGemini } from "../integrations/gemini.integration"
import { readImageAsBase64 } from "../utils/convertImageToBase64.util"
import { UploadInput } from "../types/upload.type"
import { validateInput } from "../utils/validateInput.util"
import { buildImageUrl } from "../utils/generatePublicImageUrl.util"
import { prisma } from "../libs/prisma"
import { ERRORS } from "../constants/errors.constant"
import { ApiError } from "../errors/apiError.error"

export async function uploadImageAndExtractValue(data: UploadInput) {
  validateInput(data)

  const { imagePath, customer_code, measure_datetime, measure_type } = data

  const type = measure_type.toUpperCase() as MeasureType

  if (!Object.values(MeasureType).includes(type)) {
    throw new ApiError(ERRORS.INVALID_TYPE, "INVALID_TYPE", 400)
  }

  const date = new Date(measure_datetime)
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const existing = await prisma.measure.findFirst({
    where: {
      customerCode: customer_code,
      measureType: type,
      measureDatetime: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  if (existing) {
    throw new ApiError(ERRORS.DUPLICATE_REPORT, "DOUBLE_REPORT", 409)
  }

  const base64Image = await readImageAsBase64(imagePath)
  const measure_value = await getMeasureValueFromGemini(base64Image)
  const measure_uuid = uuidv4()
  const image_url = buildImageUrl(imagePath)

  await prisma.measure.create({
    data: {
      id: measure_uuid,
      customerCode: customer_code,
      measureDatetime: date,
      measureType: type,
      measureValue: measure_value,
      hasConfirmed: false,
      imageUrl: image_url,
    },
  })

  return {
    image_url,
    measure_value,
    measure_uuid,
  }
}
