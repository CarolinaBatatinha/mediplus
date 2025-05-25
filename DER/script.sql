-- 1. Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20), 
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now()

-- 2. Profissionais de saúde
CREATE TABLE IF NOT EXISTS profissionais_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    crm VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    tipo_medicamento VARCHAR(20) NOT NULL 
        CHECK (tipo_medicamento IN ('comprimido', 'líquido', 'gotas', 'injetável')),
    dosagem VARCHAR(100) NOT NULL,
    frequencia VARCHAR(100) NOT NULL,
    data_inicial DATE NOT NULL,
    duracao_tratamento INTEGER NOT NULL 
        CHECK (duracao_tratamento > 0), -- em dias
    medico_responsavel VARCHAR(200), -- opcional
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    medicamento_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES medicamentos(id) ON DELETE CASCADE,
    horario TIME NOT NULL,
    repeticao INTERVAL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(medicamento_id, horario)
);

-- 5. Histórico de consumo
CREATE TABLE IF NOT EXISTS historico_consumo (
    id SERIAL PRIMARY KEY,
    agendamento_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES agendamentos(id) ON DELETE CASCADE,
    momento_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
    status CHAR(1) NOT NULL CHECK (status IN ('T','P')),
    observacoes TEXT
);

CREATE OR REPLACE FUNCTION fn_proibir_update_historico()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP IN ('UPDATE','DELETE') THEN
        IF now() > (OLD.momento_registro + INTERVAL '24 hours') THEN
            RAISE EXCEPTION 
              'Não é permitido alterar registros com mais de 24 horas';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_historico_no_edit_24h
  BEFORE UPDATE OR DELETE ON historico_consumo
  FOR EACH ROW EXECUTE FUNCTION fn_proibir_update_historico(); (editado)

-- 6. Autorizações de alertas
CREATE TABLE IF NOT EXISTS autorizacoes_alertas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    cuidador_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    autorizado BOOLEAN NOT NULL DEFAULT FALSE,
    data_autorizacao TIMESTAMPTZ DEFAULT now(),
    UNIQUE(usuario_id, cuidador_id)
);

-- 7. Relatórios de tratamento
CREATE TABLE IF NOT EXISTS relatorios_tratamento (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    profissional_id INTEGER FOREIGN KEY NOT NULL 
        REFERENCES profissionais_saude(id) ON DELETE CASCADE,
    data_geracao TIMESTAMPTZ NOT NULL DEFAULT now(),
    conteudo TEXT NOT NULL
);
