import { prisma } from "../libs/prisma.lib"
import { MeasureType } from "@prisma/client"
import { ApiError } from "../errors/apiError.error"

export async function listMeasures(
  customer_code: string,
  measure_type?: string
) {
  if (!customer_code?.trim()) {
    throw new ApiError("Código do cliente não informado", "INVALID_DATA", 400)
  }

  let filterType: MeasureType | undefined = undefined

  if (measure_type) {
    const normalizedType = measure_type.trim().toUpperCase()

    if (!["WATER", "GAS"].includes(normalizedType)) {
      throw new ApiError("Tipo de medição não permitida", "INVALID_TYPE", 400)
    }

    filterType = normalizedType as MeasureType
  }

  const measures = await prisma.measure.findMany({
    where: {
      customerCode: customer_code,
      ...(filterType && { measureType: filterType }),
    },
    select: {
      id: true,
      measureDatetime: true,
      measureType: true,
      hasConfirmed: true,
      imageUrl: true,
    },
    orderBy: {
      measureDatetime: "desc",
    },
  })

  if (measures.length === 0) {
    throw new ApiError("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND", 404)
  }

  return {
    customer_code,
    measures: measures.map((m) => ({
      measure_uuid: m.id,
      measure_datetime: m.measureDatetime,
      measure_type: m.measureType,
      has_confirmed: m.hasConfirmed,
      image_url: m.imageUrl,
    })),
  }
}
