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

  static async create({ usuario_id, nome, tipo_medicamento, dosagem, frequencia, data_inicial, medico_responsavel }) {
    const result = await pool.query(
      'INSERT INTO medicamentos (usuario_id, nome, tipo_medicamento, dosagem, frequencia, data_inicial, medico_responsavel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [usuario_id, nome, tipo_medicamento, dosagem, frequencia, data_inicial, medico_responsavel]
    );
    return result.rows[0];
  }

  static async update(id, { usuario_id, nome, tipo_medicamento, dosagem, frequencia, data_inicial, medico_responsavel }) {
    const result = await pool.query(
      'UPDATE medicamentos SET nome=$2, tipo_medicamento=$3, dosagem=$4, frequencia=$5, data_inicial=$6, medico_responsavel=$7 WHERE id=$1 RETURNING *',
      [usuario_id, nome, tipo_medicamento, dosagem, frequencia, data_inicial, medico_responsavel]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM medicamentos WHERE id = $1', [id]);
    return true;
  }
}

module.exports = Medicamento;