import { PrismaClient, MeasureType } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

interface UploadInput {
  imagePath: string // novo campo
  customer_code: string
  measure_datetime: string
  measure_type: string
}

export async function uploadImageAndExtractValue(data: UploadInput) {
  const { imagePath, customer_code, measure_datetime, measure_type } = data

  if (!imagePath || !customer_code || !measure_datetime || !measure_type) {
    throw new Error("Campos obrigatórios ausentes")
  }

  const type = measure_type.toUpperCase() as MeasureType

  if (!Object.values(MeasureType).includes(type)) {
    throw new Error("Tipo de medição inválido")
  }

  const date = new Date(measure_datetime)
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const existing = await prisma.measure.findFirst({
    where: {
      customerCode: customer_code,
      measureType: type,
      measureDatetime: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  if (existing) {
    throw {
      code: "DOUBLE_REPORT",
      message: "Leitura do mês já realizada",
    }
  }

  const base64Image = fs.readFileSync(imagePath, { encoding: "base64" })
  const measure_value = await getMeasureValueFromGemini(base64Image)

  const measure_uuid = uuidv4()
  const filename = path.basename(imagePath)
  const image_url = `http://localhost/uploads/${filename}`

  await prisma.measure.create({
    data: {
      id: measure_uuid,
      customerCode: customer_code,
      measureDatetime: date,
      measureType: type,
      measureValue: measure_value,
      hasConfirmed: false,
      imageUrl: image_url,
    },
  })

  return {
    image_url,
    measure_value,
    measure_uuid,
  }
}

async function getMeasureValueFromGemini(base64Image: string): Promise<number> {
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
