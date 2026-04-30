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

app.post('/equipamentos', async (req, res) => {
    try {
        const query = `
            INSERT INTO equipamentos (modelo, patrimonio, descricao, status, observacoes) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
            `
        const { modelo, patrimonio, descricao, status, observacoes } = req.body
        const valores = [modelo, patrimonio, descricao, status, observacoes]

        const resultado = await pool.query(query, valores)
        const novoItem = resultado.rows[0];
        res.status(201).json(novoItem)
    } catch (erro) {
        if (erro === '23505') {
            return res.status(409).json({ message: 'Erro: este número de patrimônio já está cadastrado' })
        }
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
})

app.get('/equipamentos', async (req, res) => {
    try {
        const query = `SELECT * FROM equipamentos`
        const resultado = await pool.query(query)
        const novoItem = resultado.rows;
        res.status(200).json(novoItem)
    } catch (erro) {
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
})

app.get('/equipamentos/:id', async (req, res) => {
    try {
        const query = `SELECT * FROM equipamentos WHERE id = $1`
        const id = req.params.id
        const valores = [id]
        const resultado = await pool.query(query, valores)
        const novoItem = resultado.rows[0];
        if (novoItem) {
            res.status(200).json(novoItem)
        } else {
            res.status(404).json({ message: 'ID de equipamento não encontrado.' })
        }
    } catch (erro) {
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
})

app.put('/equipamentos/:id', async (req, res) => {
    try {
        const query = `UPDATE equipamentos SET status = $1, observacoes = $2 WHERE id = $3 RETURNING *`
        const id = req.params.id
        const { status, observacoes } = req.body
        const valores = [status, observacoes, id]
        const resultado = await pool.query(query, valores)
        const novoItem = resultado.rows[0];
        res.status(200).json(novoItem)
    } catch (erro) {
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
})

app.delete('/equipamentos/:id', async (req, res) => {
    try {
        const query = `DELETE FROM equipamentos WHERE id = $1`
        const id = req.params.id
        const valores = [id]
        const resultado = await pool.query(query, valores)
        if (resultado.rowCount > 0) {
            res.status(200).json({ message: `Equipamento com id ${id}, deletado com sucesso` })
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado para exclusão.' });
        }
    } catch (erro) {
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
})