const Medicamento = require('../models/Medicamento');

// Adicione validações básicas
const validarMedicamento = (data) => {
  if (!data.nome || !data.dosagem || !data.frequencia) {
    throw new Error('Campos obrigatórios faltando: nome, dosagem, frequencia');
  }
};

exports.listarMedicamentos = async (req, res) => {
  try {
    // Adicione paginação básica
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
    // Validação antes de criar
    validarMedicamento(req.body);
    
    // Adiciona o usuário autenticado (se houver)
    const usuarioId = req.user?.id;
    const dadosMedicamento = { ...req.body, usuario_id: usuarioId };
    
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
    // Verifica se o medicamento existe
    const medicamentoExistente = await Medicamento.findById(req.params.id);
    if (!medicamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Medicamento não encontrado'
      });
    }

    // Validação antes de atualizar
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
    // Verifica existência antes de deletar
    const medicamentoExistente = await Medicamento.findById(req.params.id);
    if (!medicamentoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Medicamento não encontrado'
      });
    }

    await Medicamento.delete(req.params.id);
    
    res.status(204).send();
  } catch (err) {
    console.error(`Erro ao deletar medicamento ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Falha ao deletar medicamento'
    });
  }
};
