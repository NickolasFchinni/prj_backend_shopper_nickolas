import { listMeasures } from "../../services/listMeasures.service"
import { prisma } from "../../libs/prisma.lib"
import { ApiError } from "../../errors/apiError.error"

jest.mock("../../libs/prisma.lib", () => ({
  prisma: {
    measure: {
      findMany: jest.fn(),
    },
  },
}))

describe("listMeasures", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deve listar medidas com sucesso", async () => {
    ;(prisma.measure.findMany as jest.Mock).mockResolvedValue([
      {
        id: "uuid-1",
        measureDatetime: new Date(),
        measureType: "WATER",
        hasConfirmed: false,
        imageUrl: "http://example.com/image.png",
      },
    ])

    const result = await listMeasures("123", "WATER")

    expect(result.customer_code).toBe("123")
    expect(result.measures.length).toBe(1)
    expect(result.measures[0]).toHaveProperty("measure_uuid")
  })

  it("deve lançar erro se customer_code não for informado", async () => {
    await expect(listMeasures("")).rejects.toThrow(ApiError)
  })

  it("deve lançar erro se tipo de medição for inválido", async () => {
    await expect(listMeasures("123", "INVALID")).rejects.toThrow(ApiError)
  })

  it("deve lançar erro se nenhuma medida for encontrada", async () => {
    ;(prisma.measure.findMany as jest.Mock).mockResolvedValue([])

    await expect(listMeasures("123", "WATER")).rejects.toThrow(ApiError)
  })
})
