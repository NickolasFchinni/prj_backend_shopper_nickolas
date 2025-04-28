import { buildImageUrl } from "../../utils/generatePublicImageUrl.util"

describe("buildImageUrl", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it("deve gerar a URL correta usando o BASE_URL do .env", () => {
    process.env.BASE_URL = "http://meusite.com"

    const imagePath = "public/uploads/minha-imagem.jpg"
    const url = buildImageUrl(imagePath)

    expect(url).toBe("http://meusite.com/uploads/minha-imagem.jpg")
  })

  it("deve usar http://localhost caso BASE_URL não esteja definido", () => {
    delete process.env.BASE_URL

    const imagePath = "public/uploads/arquivo-teste.png"
    const url = buildImageUrl(imagePath)

    expect(url).toBe("http://localhost/uploads/arquivo-teste.png")
  })
})
