import { confirmReading } from "../../services/confirm.service"
import { prisma } from "../../libs/prisma.lib"
import { ApiError } from "../../errors/apiError.error"

jest.mock("../../libs/prisma.lib", () => ({
  prisma: {
    measure: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe("confirmReading", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deve confirmar leitura com sucesso", async () => {
    ;(prisma.measure.findUnique as jest.Mock).mockResolvedValue({
      id: "uuid-123",
      hasConfirmed: false,
    })

    await confirmReading("uuid-123", 1500)

    expect(prisma.measure.update).toHaveBeenCalledWith({
      where: { id: "uuid-123" },
      data: {
        hasConfirmed: true,
        measureValue: 1500,
      },
    })
  })

  it("deve lançar erro se measure_uuid não for informado", async () => {
    await expect(confirmReading("", 1500)).rejects.toThrow(ApiError)
  })

  it("deve lançar erro se leitura não for encontrada", async () => {
    ;(prisma.measure.findUnique as jest.Mock).mockResolvedValue(null)

    await expect(confirmReading("uuid-nao-existe")).rejects.toThrow(ApiError)
  })

  it("deve lançar erro se leitura já estiver confirmada", async () => {
    ;(prisma.measure.findUnique as jest.Mock).mockResolvedValue({
      id: "uuid-123",
      hasConfirmed: true,
    })

    await expect(confirmReading("uuid-123")).rejects.toThrow(ApiError)
  })
})
