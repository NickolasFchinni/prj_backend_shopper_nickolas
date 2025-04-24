import { Request, Response } from "express"
import { confirmReading } from "../services/confirm.service"
import { handleError } from "../utils/handleError.util"

export async function handleConfirm(req: Request, res: Response) {
  try {
    const { measure_uuid, confirmed_value } = req.body
    const result = await confirmReading(measure_uuid, confirmed_value)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}
