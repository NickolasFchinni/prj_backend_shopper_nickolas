import { handleConfirm } from "../../controllers/confirm.controller"
import { confirmReading } from "../../services/confirm.service"
import { ApiError } from "../../errors/apiError.error"
import { Request, Response } from "express"

jest.mock("../../services/confirm.service")

describe("handleConfirm", () => {
  const mockReq = {} as Request
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any

  beforeEach(() => {
    jest.clearAllMocks() 
  })

  it("deve confirmar a leitura e retornar sucesso", async () => {
    mockReq.body = {
      measure_uuid: "uuid-123",
      confirmed_value: 1234,
    }
    ;(confirmReading as jest.Mock).mockResolvedValue({
      success: true,
      message: "Leitura confirmada com sucesso",
    })

    await handleConfirm(mockReq, mockRes)

    expect(confirmReading).toHaveBeenCalledWith("uuid-123", 1234)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Leitura confirmada com sucesso",
    })
  })

  it("deve retornar erro se o service lançar erro", async () => {
    mockReq.body = {
      measure_uuid: "uuid-erro",
      confirmed_value: 0,
    }

    const error = new ApiError("Valor inválido", "", 400)

    ;(confirmReading as jest.Mock).mockRejectedValue(error)

    await handleConfirm(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error_code: error.code,
        error_description: error.message,
      })
    )
  })
})
