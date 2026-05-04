import pool from "../config/db.js";

export const listarEquipamentos = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM equipamentos')
        res.status(200).json(resultado.rows)
    } catch (erro) {
        res.status(500).json({ message: erro.message })
    }
}

export const cadastrarEquipamentos = async (req, res) => {
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
        if (erro.code === '23505') {
            return res.status(409).json({ message: 'Erro: este número de patrimônio já está cadastrado' })
        }
        res.status(500).json({ message: `${erro.message} - Erro interno do servidor.` })
    }
}

export const consultarPorID = async (req, res) => {
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
}

export const editarPorID = async (req, res) => {
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
}

export const deletarEquipamento = async (req, res) => {
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
}