import { Response } from "express"
import { ApiError } from "../errors/apiError.error"

export function handleError(res: Response, error: unknown): void {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      error_code: error.code,
      error_description: error.message,
    })
  } else {
    console.error("Erro inesperado:", error)
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Erro interno do servidor",
    })
  }
}
