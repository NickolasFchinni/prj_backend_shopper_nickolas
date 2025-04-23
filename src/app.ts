import express from "express"
import dotenv from "dotenv"
import testRoutes from "./routes/test.routes"
import cors from "cors"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API funcionando!")
})

app.use(testRoutes)

const PORT = 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
