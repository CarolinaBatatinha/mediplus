const Agendamento = require('../models/Agendamento');

exports.listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criarAgendamento = async (req, res) => {
  try {
    const novoAgendamento = await Agendamento.create(req.body);
    res.status(201).json(novoAgendamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.atualizarAgendamento = async (req, res) => {
  try {
    const agendamentoAtualizado = await Agendamento.update(req.params.id, req.body);
    if (!agendamentoAtualizado) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json(agendamentoAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletarAgendamento = async (req, res) => {
  try {
    await Agendamento.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
