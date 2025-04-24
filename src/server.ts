import express from "express"
import cors from "cors"
import path from "path"
import uploadRoutes from "./routes/upload.route"
import confirmRoutes from "./routes/confirm.route"
import listMeasuresRoutes from "./routes/listMeasures.route"

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
  app.use(confirmRoutes)
  app.use(listMeasuresRoutes)

  return app
}
