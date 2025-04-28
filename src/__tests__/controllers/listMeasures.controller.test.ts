import { handleListMeasures } from "../../controllers/listMeasures.controller"
import { listMeasures } from "../../services/listMeasures.service"
import { Request, Response } from "express"

jest.mock("../../services/listMeasures.service")

describe("handleListMeasures", () => {
  const mockReq = {} as Request
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any

  it("deve listar as leituras com sucesso", async () => {
    mockReq.params = { customer_code: "123" }
    mockReq.query = { measure_type: "WATER" }
    ;(listMeasures as jest.Mock).mockResolvedValue({
      customer_code: "123",
      measures: [],
    })

    await handleListMeasures(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      customer_code: "123",
      measures: [],
    })
  })

  it("deve retornar erro caso algo dê errado", async () => {
    mockReq.params = { customer_code: "123" }
    mockReq.query = { measure_type: "INVALID" }
    ;(listMeasures as jest.Mock).mockRejectedValue(
      new Error("Tipo de medição inválido")
    )

    await handleListMeasures(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error_code: "INTERNAL_ERROR" })
    )
  })
})
