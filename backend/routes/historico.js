const express = require('express');
const historicoController = require('../controllers/historicoController');
const historicoRouter = express.Router();

historicoRouter.get('/', historicoController.listarHistorico);
historicoRouter.get('/:id', historicoController.buscarHistorico);
historicoRouter.post('/', historicoController.criarHistorico);
historicoRouter.put('/:id', historicoController.atualizarHistorico);
historicoRouter.delete('/:id', historicoController.deletarHistorico);

module.exports = historicoRouter;