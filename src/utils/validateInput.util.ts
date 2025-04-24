import { ERRORS } from "../constants/errors.constant"
import { UploadInput } from "../types/upload.type"
import { MeasureType } from "@prisma/client"

export function validateInput(data: UploadInput) {
  const { imagePath, customer_code, measure_datetime, measure_type } = data
  if (!imagePath || !customer_code || !measure_datetime || !measure_type) {
    throw new Error(ERRORS.MISSING_FIELDS)
  }
  if (
    !Object.values(MeasureType).includes(
      measure_type.toUpperCase() as MeasureType
    )
  ) {
    throw new Error(ERRORS.INVALID_TYPE)
  }
}
