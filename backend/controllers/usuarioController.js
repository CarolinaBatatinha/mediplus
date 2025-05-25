const Usuario = require('../models/usuario');

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    console.error('>> Erro em criar/listar/etc:', err);
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
    console.error('>> Erro em criar/listar/etc:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.criarUsuario = async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (err) {
    console.error('>> Erro em criar/listar/etc:', err);
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
    console.error('>> Erro em criar/listar/etc:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    await Usuario.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('>> Erro em criar/listar/etc:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarParcial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ success: false, message: 'Nome e email são obrigatórios' });
    }

    const usuarioAtualizado = await Usuario.updatePartial(id, { nome, email });

    if (!usuarioAtualizado) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.json({ success: true, data: usuarioAtualizado, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar parcialmente o usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
};
