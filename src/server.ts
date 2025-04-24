import express from "express"
import cors from "cors"
import path from "path"
import uploadRoutes from "./routes/upload.routes"

export function createServer() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: "10mb" }))

  app.get("/", (req, res) => {
    res.send("API funcionando!")
  })

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "public", "uploads"))
  )

  app.use(uploadRoutes)

  return app
}
