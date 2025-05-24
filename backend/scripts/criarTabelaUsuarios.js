const pool = require('../src/db');

async function criarTabela() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        telefone VARCHAR(20),
        senha_hash TEXT
      );
    `);
    console.log('Tabela "usuarios" criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela:', error.message);
  } finally {
    await pool.end(); 
  }
}

criarTabela();