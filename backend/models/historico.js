const pool = require('../src/db');

class Historico {
  static async findAll() {
    const result = await pool.query('SELECT * FROM historico_consumo');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM historico_consumo WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ agendamento_id, status, observacoes }) {
    const result = await pool.query(
      'INSERT INTO historico_consumo (agendamento_id, status, observacoes) VALUES ($1, $2, $3) RETURNING *',
      [agendamento_id, status, observacoes]
    );
    return result.rows[0];
  }

  static async update(id, { status, observacoes }) {
    const result = await pool.query(
      'UPDATE historico_consumo SET status=$1, observacoes=$2 WHERE id=$3 RETURNING *',
      [status, observacoes, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM historico_consumo WHERE id = $1', [id]);
    return true;
  }
}

module.exports = Historico;
