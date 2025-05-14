const Usuario = require('../models/usuario');

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criarUsuario = async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.update(req.params.id, req.body);
    if (!usuarioAtualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    await Usuario.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
