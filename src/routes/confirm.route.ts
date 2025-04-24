import { Router } from "express"
import { handleConfirm } from "../controllers/confirm.controller"

const router = Router()

router.patch("/confirm", handleConfirm)

export default router
