const express = require('express');
const medicamentosController = require('../controllers/medicamentosController');
const medicamentosRouter = express.Router();

medicamentosRouter.get('/', medicamentosController.listarMedicamentos);
medicamentosRouter.get('/:id', medicamentosController.buscarMedicamento);
medicamentosRouter.post('/', medicamentosController.criarMedicamento);
medicamentosRouter.put('/:id', medicamentosController.atualizarMedicamento);
medicamentosRouter.delete('/:id', medicamentosController.deletarMedicamento);
medicamentosRouter.get('/usuario/:usuarioId', medicamentosController.buscarPorUsuario);
medicamentosRouter.patch('/:id/status', medicamentosController.atualizarStatus);

module.exports = medicamentosRouter;