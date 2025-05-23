const express = require('express');
const usuariosRouter = require('../routes/usuario');
const medicamentosRouter = require('../routes/medicamentos');
const agendamentosRouter = require('../routes/agendamentos'); 
const historicoRouter = require('../routes/historico');
const authRouter = require('../routes/auth');
const app = express();

app.use(express.json());
app.use((err, req, res, next) => {
  console.error('>> Unhandled error:', err);
  next(err);
});

// Rotas
app.use('/usuarios', usuariosRouter);
app.use('/medicamentos', medicamentosRouter);
app.use('/agendamentos', agendamentosRouter);
app.use('/historico', historicoRouter);
app.use('/login', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
