import 'dotenv/config'
import express from 'express'
import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Servidor rodando com sucesso.')
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})

async function testarConexao() {
    try {
        const res = await pool.query('SELECT NOW()')
        console.log('Conexão com o banco bem-sucedida! Data/Hora do DB:', res.rows[0].now)
    } catch (erro) {
        console.error('Erro ao conectar com o banco de dados:', erro)
    }
}

testarConexao()