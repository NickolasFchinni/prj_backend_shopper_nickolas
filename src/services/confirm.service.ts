import { prisma } from "../libs/prisma.lib"
import { ApiError } from "../errors/apiError.error"

export async function confirmReading(
  measure_uuid: string,
  confirmed_value?: number
) {
  if (!measure_uuid) {
    throw new ApiError("ID da leitura não informado", "INVALID_DATA", 400)
  }

  const measure = await prisma.measure.findUnique({
    where: { id: measure_uuid },
  })

  if (!measure) {
    throw new ApiError("Leitura não encontrada", "MEASURE_NOT_FOUND", 404)
  }

  if (measure.hasConfirmed) {
    throw new ApiError("Leitura já confirmada", "CONFIRMATION_DUPLICATE", 409)
  }

  await prisma.measure.update({
    where: { id: measure_uuid },
    data: {
      hasConfirmed: true,
      ...(confirmed_value !== undefined && { measureValue: confirmed_value }),
    },
  })

  return { success: true }
}
