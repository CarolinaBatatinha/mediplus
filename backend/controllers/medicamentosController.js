const Medicamento = require('../../models/Medicamento');

const validarMedicamento = (data) => {
  if (!data.nome || !data.dosagem || !data.frequencia) {
    throw new Error('Campos obrigatórios faltando: nome, dosagem, frequencia');
  }
};

exports.listarMedicamentos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const medicamentos = await Medicamento.findAll({ limit, offset });
    res.json({
      success: true,
      data: medicamentos,
      pagination: {
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (err) {
    console.error('Erro ao listar medicamentos:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

exports.buscarMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.findById(req.params.id);
    if (!medicamento) {
      return res.status(404).json({
        success: false,
        error: 'Medicamento não encontrado'
      });
    }
    res.json({
      success: true,
      data: medicamento
    });
  } catch (err) {
    console.error(`Erro ao buscar medicamento ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

exports.criarMedicamento = async (req, res) => {
  try {
    console.log('Body recebido:', req.body);
    validarMedicamento(req.body);

    const dadosMedicamento = req.body;

    const novoMedicamento = await Medicamento.create(dadosMedicamento);

    res.status(201).json({
      success: true,
      data: novoMedicamento,
      message: 'Medicamento criado com sucesso'
    });
  } catch (err) {
    console.error('Erro ao criar medicamento:', err);

    if (err.message.includes('Campos obrigatórios')) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Falha ao criar medicamento'
    });
  }
};

exports.atualizarMedicamento = async (req, res) => {
  try {
    const medicamentoExistente = await Medicamento.findById(req.params.id);
    if (!medicamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Medicamento não encontrado'
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum dado fornecido para atualização'
      });
    }

    const medicamentoAtualizado = await Medicamento.update(req.params.id, req.body);

    res.json({
      success: true,
      data: medicamentoAtualizado,
      message: 'Medicamento atualizado com sucesso'
    });
  } catch (err) {
    console.error(`Erro ao atualizar medicamento ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Falha ao atualizar medicamento'
    });
  }
};

exports.deletarMedicamento = async (req, res) => {
  try {
    const medicamentoExistente = await Medicamento.findById(req.params.id);
    if (!medicamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Medicamento não encontrado'
      });
    }

    await Medicamento.delete(req.params.id);

    res.status(200).json({ success: true, message: 'Medicamento excluído com sucesso' });
  } catch (err) {
    console.error(`Erro ao deletar medicamento ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Falha ao deletar medicamento'
    });
  }
};

exports.buscarPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const medicamentos = await Medicamento.findByUsuarioId(usuarioId);

    if (medicamentos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum medicamento encontrado para este usuário'
      });
    }

    res.json({
      success: true,
      data: medicamentos
    });
  } catch (err) {
    console.error('Erro ao buscar medicamentos por usuário:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status é obrigatório' });
    }

    const medicamento = await Medicamento.findById(id);

    if (!medicamento) {
      return res.status(404).json({ success: false, error: 'Medicamento não encontrado' });
    }

    const atualizado = await Medicamento.updateStatus(id, status);

    res.json({
      success: true,
      data: atualizado,
      message: 'Status atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar status do medicamento:', error);
    res.status(500).json({ success: false, error: 'Erro no servidor' });
  }
};
