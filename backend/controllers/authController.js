const pool = require('../src/db');

const authController = {
  async login(req, res) {
    const { email, senha_hash } = req.body;

    if (!email || !senha_hash ) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];

      if (user.senha_hash !== senha_hash) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: {
          id: user.id,
          nome: user.nome_completo,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
  },
};

module.exports = authController;
