const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')  // assume que .env está em backend/.env
});

console.log('>>> carregou .env de:', path.resolve(__dirname, '../.env'));
console.log('>>> PGHOST lido:', process.env.PGHOST);


const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
