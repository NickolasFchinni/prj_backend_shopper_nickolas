import { Request, Response } from "express"
import { listMeasures } from "../services/listMeasures.service"
import { handleError } from "../utils/handleError.util"

export async function handleListMeasures(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { customer_code } = req.params
    const { measure_type } = req.query

    const result = await listMeasures(
      customer_code,
      measure_type as string | undefined
    )
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}
