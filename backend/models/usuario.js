const pool = require('../src/db');

class Usuario {
  static async findAll() {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ nome, email, senha_hash }) {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha_hash]
    );
    return result.rows[0];
  }

  static async update(id, { nome, email, senha_hash }) {
    const result = await pool.query(
      'UPDATE usuarios SET nome=$1, email=$2, senha_hash=$3 WHERE id=$4 RETURNING *',
      [nome, email, senha_hash, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return true;
  }
}

module.exports = Usuario;
