import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import uploadRoutes from "./routes/upload.routes"
import path from "path"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use(express.json({ limit: "10mb" }))

app.get("/", (req, res) => {
  res.send("API funcionando!")
})

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads"))
)

app.use(uploadRoutes)

const PORT = 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
