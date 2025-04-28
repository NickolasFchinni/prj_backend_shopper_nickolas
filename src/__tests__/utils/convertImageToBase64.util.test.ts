import { readImageAsBase64 } from "../../utils/convertImageToBase64.util"
import fs from "fs"

jest.mock("fs", () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}))

describe("readImageAsBase64", () => {
  it("deve retornar a imagem convertida em base64", async () => {
    const fakeBase64 = "dGVzdGUtY29udGV1ZG8="
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(fakeBase64)

    const result = await readImageAsBase64("caminho/fake.jpg")

    expect(fs.existsSync).toHaveBeenCalledWith("caminho/fake.jpg")
    expect(fs.promises.readFile).toHaveBeenCalledWith("caminho/fake.jpg", {
      encoding: "base64",
    })
    expect(result).toBe(fakeBase64)
  })

  it("deve lançar erro se a imagem não existir", async () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)

    await expect(readImageAsBase64("caminho/inexistente.jpg")).rejects.toThrow(
      "Imagem não encontrada"
    )
  })
})
