import { validateInput } from "../../utils/validateInput.util"

describe("validateInput", () => {
  it("deve lançar erro se algum campo obrigatório estiver ausente", () => {
    expect(() => {
      validateInput({
        imagePath: "",
        customer_code: "",
        measure_datetime: "",
        measure_type: "",
      })
    }).toThrow("Campos obrigatórios ausentes")
  })

  it("deve lançar erro se o tipo de medição for inválido", () => {
    expect(() => {
      validateInput({
        imagePath: "caminho/para/imagem.png",
        customer_code: "12345",
        measure_datetime: "2025-04-26",
        measure_type: "invalid-type",
      })
    }).toThrow("Tipo de medição inválido")
  })

  it("não deve lançar erro se os dados forem válidos", () => {
    expect(() => {
      validateInput({
        imagePath: "caminho/para/imagem.png",
        customer_code: "12345",
        measure_datetime: "2025-04-26",
        measure_type: "WATER",
      })
    }).not.toThrow()
  })
})
