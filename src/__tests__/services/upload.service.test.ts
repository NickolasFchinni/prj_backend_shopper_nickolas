import { uploadImageAndExtractValue } from "../../services/upload.service"
import { prisma } from "../../libs/prisma.lib"
import { readImageAsBase64 } from "../../utils/convertImageToBase64.util"
import { getMeasureValueFromGemini } from "../../integrations/gemini.integration"
import { buildImageUrl } from "../../utils/generatePublicImageUrl.util"
import { ApiError } from "../../errors/apiError.error"

jest.mock("../../libs/prisma.lib", () => ({
  prisma: {
    measure: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))
jest.mock("../../utils/convertImageToBase64.util", () => ({
  readImageAsBase64: jest.fn(),
}))
jest.mock("../../integrations/gemini.integration", () => ({
  getMeasureValueFromGemini: jest.fn(),
}))
jest.mock("../../utils/generatePublicImageUrl.util", () => ({
  buildImageUrl: jest.fn(),
}))

describe("uploadImageAndExtractValue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(prisma.measure.findFirst as jest.Mock).mockResolvedValue(null)
    ;(readImageAsBase64 as jest.Mock).mockResolvedValue("fake-base64")
    ;(getMeasureValueFromGemini as jest.Mock).mockResolvedValue(1234)
    ;(buildImageUrl as jest.Mock).mockReturnValue(
      "http://example.com/image.png"
    )
  })

  it("deve criar nova medida com sucesso", async () => {
    const input = {
      imagePath: "path/to/image.jpg",
      customer_code: "123",
      measure_datetime: "2025-04-24T10:00:00.000Z",
      measure_type: "WATER",
    }

    const result = await uploadImageAndExtractValue(input)

    expect(prisma.measure.create).toHaveBeenCalled()
    expect(result).toHaveProperty("image_url")
    expect(result).toHaveProperty("measure_value")
    expect(result).toHaveProperty("measure_uuid")
  })

  it("deve lançar erro se tipo de medição for inválido", async () => {
    const input = {
      imagePath: "path/to/image.jpg",
      customer_code: "123",
      measure_datetime: "2025-04-24T10:00:00.000Z",
      measure_type: "INVALID",
    }

    await expect(uploadImageAndExtractValue(input)).rejects.toThrow(Error)
  })

  it("deve lançar erro se já existir medição no mesmo mês", async () => {
    ;(prisma.measure.findFirst as jest.Mock).mockResolvedValue({
      id: "existing",
    })

    const input = {
      imagePath: "path/to/image.jpg",
      customer_code: "123",
      measure_datetime: "2025-04-24T10:00:00.000Z",
      measure_type: "WATER",
    }

    await expect(uploadImageAndExtractValue(input)).rejects.toThrow(Error)
  })
})
