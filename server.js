import 'dotenv/config'
import express from 'express'
import router from './src/routes/equipamentoRoutes.js'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use('/equipamentos', router)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})