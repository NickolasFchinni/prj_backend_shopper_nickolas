import { PrismaClient, MeasureType } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

interface UploadInput {
  image: string
  customer_code: string
  measure_datetime: string
  measure_type: string
}

export async function uploadImageAndExtractValue(data: UploadInput) {
  const { image, customer_code, measure_datetime, measure_type } = data

  if (!image || !customer_code || !measure_datetime || !measure_type) {
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

  const measure_value = await getMeasureValueFromGemini(image)

  const measure_uuid = uuidv4()
  const image_url = saveBase64Image(image, measure_uuid)

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

    console.log("Resposta completa da API:", response.data) // Log para debug

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

function saveBase64Image(base64: string, filename: string): string {
  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) throw new Error("Imagem em base64 inválida")

  const ext = matches[1]
  const data = matches[2]
  const buffer = Buffer.from(data, "base64")

  const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads")
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const fileName = `${filename}.${ext}`
  const filePath = path.join(uploadsDir, fileName)

  fs.writeFileSync(filePath, buffer)

  console.log("Imagem salva em:", filePath)

  return `http://localhost:3000/uploads/${fileName}`
}
