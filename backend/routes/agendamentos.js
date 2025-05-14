const express = require('express');
const agendamentosController = require('../controllers/agendamentosController');
const agendamentosRouter = express.Router();

agendamentosRouter.get('/', agendamentosController.listarAgendamentos);
agendamentosRouter.get('/:id', agendamentosController.buscarAgendamento);
agendamentosRouter.post('/', agendamentosController.criarAgendamento);
agendamentosRouter.put('/:id', agendamentosController.atualizarAgendamento);
agendamentosRouter.delete('/:id', agendamentosController.deletarAgendamento);

module.exports = agendamentosRouter;