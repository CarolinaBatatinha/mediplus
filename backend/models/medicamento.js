const pool = require('../src/db');

class Medicamento {
  static async findAll() {
    const result = await pool.query('SELECT * FROM medicamentos');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM medicamentos WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ usuario_id, nome, dosagem, frequencia }) {
    const result = await pool.query(
      'INSERT INTO medicamentos (usuario_id, nome, dosagem, frequencia) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, nome, dosagem, frequencia]
    );
    return result.rows[0];
  }

  static async update(id, { nome, dosagem, frequencia }) {
    const result = await pool.query(
      'UPDATE medicamentos SET nome=$1, dosagem=$2, frequencia=$3 WHERE id=$4 RETURNING *',
      [nome, dosagem, frequencia, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM medicamentos WHERE id = $1', [id]);
    return true;
  }
}

module.exports = Medicamento;