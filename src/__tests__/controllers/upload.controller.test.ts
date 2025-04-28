import { handleUpload } from "../../controllers/upload.controller"
import { uploadImageAndExtractValue } from "../../services/upload.service"
import { ApiError } from "../../errors/apiError.error"
import { Request, Response } from "express"

jest.mock("../../services/upload.service")

describe("handleUpload", () => {
  const mockReq = {} as Request
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any

  it("deve enviar imagem e retornar sucesso", async () => {
    mockReq.file = {
      fieldname: "file",
      originalname: "image.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      size: 1234,
      destination: "fake/path",
      filename: "image.jpg",
      path: "fake/path/image.jpg",
      buffer: Buffer.from("fake-image-buffer"),
    } as Express.Multer.File
    mockReq.body = {
      customer_code: "123",
      measure_datetime: "2025-04-24T10:00:00.000Z",
      measure_type: "WATER",
    }
    ;(uploadImageAndExtractValue as jest.Mock).mockResolvedValue({
      image_url: "http://localhost/uploads/fake.png",
      measure_value: 1234,
      measure_uuid: "uuid-123",
    })

    await handleUpload(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      image_url: "http://localhost/uploads/fake.png",
      measure_value: 1234,
      measure_uuid: "uuid-123",
    })
  })

  it("deve retornar erro se imagem não for enviada", async () => {
    mockReq.file = undefined
    mockReq.body = {}

    await handleUpload(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error_code: "IMAGE_MISSING" })
    )
  })
})
