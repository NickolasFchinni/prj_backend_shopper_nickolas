import { Router } from "express"
import { handleListMeasures } from "../controllers/listMeasures.controller"

const router = Router()

router.get("/:customer_code/list", handleListMeasures)

export default router
