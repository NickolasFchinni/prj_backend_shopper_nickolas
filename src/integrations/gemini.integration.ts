import axios from "axios"

export async function getMeasureValueFromGemini(
  base64Image: string
): Promise<number> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada")

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Observe a imagem a seguir. Qual é o número que aparece no visor do medidor?",
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                },
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    )

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!result) throw new Error("Resposta da API não contém texto")

    const match = result.match(/\d+/)
    if (!match)
      throw new Error("Não foi possível extrair um número da resposta da IA")

    return parseInt(match[0], 10)
  } catch (error: any) {
    console.error(
      "Erro na chamada da API Gemini:",
      error.response?.data || error.message
    )
    throw new Error(`Falha ao processar imagem: ${error.message}`)
  }
}
