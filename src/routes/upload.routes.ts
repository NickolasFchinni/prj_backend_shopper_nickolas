import { Router } from "express"
import { handleUpload } from "../controllers/upload.controller"
import { upload } from "../middlewares/upload.middleware"

const router = Router()

router.post("/upload", upload, handleUpload)

export default router
