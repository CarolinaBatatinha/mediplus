const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const usuariosRouter = express.Router();


usuariosRouter.get('/', usuarioController.listarUsuarios);
usuariosRouter.get('/:id', usuarioController.buscarUsuario); // busca usuário por ID
usuariosRouter.post('/', usuarioController.criarUsuario);
usuariosRouter.put('/:id', usuarioController.atualizarUsuario);
usuariosRouter.delete('/:id', usuarioController.deletarUsuario);


module.exports = usuariosRouter;