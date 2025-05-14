const express = require('express');
const pool = require('../src/db');
const agendamentosRouter = express.Router();

agendamentosRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agendamentos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

agendamentosRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

agendamentosRouter.post('/', async (req, res) => {
  try {
    const { medicamento_id, horario, repeticao } = req.body;
    const result = await pool.query(
      `INSERT INTO agendamentos (medicamento_id, horario, repeticao)
       VALUES ($1,$2,$3) RETURNING *`,
      [medicamento_id, horario, repeticao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

agendamentosRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { horario, repeticao } = req.body;
    const result = await pool.query(
      `UPDATE agendamentos SET horario=$1, repeticao=$2 WHERE id=$3 RETURNING *`,
      [horario, repeticao, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

agendamentosRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = agendamentosRouter;
