import dotenv from "dotenv"
import { createServer } from "./server"

dotenv.config()

const app = createServer()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
