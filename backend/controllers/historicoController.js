const Historico = require('../models/Historico');

exports.listarHistorico = async (req, res) => {
  try {
    const historicos = await Historico.findAll();
    res.json(historicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarHistorico = async (req, res) => {
  try {
    const historico = await Historico.findById(req.params.id);
    if (!historico) {
      return res.status(404).json({ error: 'Registro histórico não encontrado' });
    }
    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criarHistorico = async (req, res) => {
  try {
    const novoHistorico = await Historico.create(req.body);
    res.status(201).json(novoHistorico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarHistorico = async (req, res) => {
  try {
    const historicoAtualizado = await Historico.update(req.params.id, req.body);
    if (!historicoAtualizado) {
      return res.status(404).json({ error: 'Registro histórico não encontrado' });
    }
    res.json(historicoAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletarHistorico = async (req, res) => {
  try {
    await Historico.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
