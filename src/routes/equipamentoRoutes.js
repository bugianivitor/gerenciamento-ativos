import { Router } from 'express'
import * as equipamentoController from '../controllers/equipamentoController.js'

const router = Router()

router
    .get('/', equipamentoController.listarEquipamentos)
    .post('/', equipamentoController.cadastrarEquipamentos)
    .delete('/:id', equipamentoController.deletarEquipamento)
    .get('/:id', equipamentoController.consultarPorID)
    .put('/:id', equipamentoController.editarPorID)

export default router