const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const usuariosRouter = express.Router();


usuariosRouter.get('/', usuarioController.listarUsuarios);
usuariosRouter.get('/:id', usuarioController.buscarUsuario);
usuariosRouter.post('/', usuarioController.criarUsuario);
usuariosRouter.put('/:id', usuarioController.atualizarUsuario);
usuariosRouter.delete('/:id', usuarioController.deletarUsuario);
usuariosRouter.patch('/:id', usuarioController.atualizarParcial);

module.exports = usuariosRouter;