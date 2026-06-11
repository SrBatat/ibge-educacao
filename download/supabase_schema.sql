-- ============================================================
-- IBGE GOTHIC PORTAL — DATABASE SCHEMA + SEED
-- Execute este bloco COMPLETO no Supabase SQL Editor
-- ============================================================

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: tb_users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  role          VARCHAR(10) NOT NULL DEFAULT 'USER'
                CHECK (role IN ('USER', 'ADMIN')),
  avatar_url    TEXT,
  is_banned     BOOLEAN NOT NULL DEFAULT FALSE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: tb_ibge_data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_ibge_data (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicador     VARCHAR(255) NOT NULL,
  descricao     TEXT,
  ano           SMALLINT NOT NULL,
  regiao        VARCHAR(50) NOT NULL,
  uf            CHAR(2),
  valor         NUMERIC(18, 4) NOT NULL,
  unidade       VARCHAR(30),
  categoria     VARCHAR(50) NOT NULL,
  subcategoria  VARCHAR(100),
  fonte         VARCHAR(100) DEFAULT 'IBGE',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ibge_data_categoria ON public.tb_ibge_data(categoria);
CREATE INDEX IF NOT EXISTS idx_ibge_data_regiao    ON public.tb_ibge_data(regiao);
CREATE INDEX IF NOT EXISTS idx_ibge_data_ano       ON public.tb_ibge_data(ano);

-- ============================================================
-- TABELA: tb_quiz_questions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_quiz_questions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pergunta         TEXT NOT NULL,
  opcao_a          TEXT NOT NULL,
  opcao_b          TEXT NOT NULL,
  opcao_c          TEXT NOT NULL,
  opcao_d          TEXT NOT NULL,
  resposta_correta CHAR(1) NOT NULL CHECK (resposta_correta IN ('A', 'B', 'C', 'D')),
  pontos           SMALLINT NOT NULL DEFAULT 100,
  dificuldade      VARCHAR(10) NOT NULL DEFAULT 'MEDIO'
                   CHECK (dificuldade IN ('FACIL', 'MEDIO', 'DIFICIL')),
  categoria        VARCHAR(50),
  explicacao       TEXT,
  ativo            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_categoria   ON public.tb_quiz_questions(categoria);
CREATE INDEX IF NOT EXISTS idx_quiz_dificuldade ON public.tb_quiz_questions(dificuldade);
CREATE INDEX IF NOT EXISTS idx_quiz_ativo       ON public.tb_quiz_questions(ativo);

-- ============================================================
-- TABELA: tb_ranking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_ranking (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.tb_users(id) ON DELETE CASCADE,
  username        VARCHAR(50) NOT NULL,
  pontuacao       INTEGER NOT NULL DEFAULT 0,
  total_acertos   SMALLINT NOT NULL DEFAULT 0,
  total_questoes  SMALLINT NOT NULL DEFAULT 0,
  tempo_gasto     INTEGER NOT NULL DEFAULT 0,
  percentual      NUMERIC(5, 2),
  data_tentativa  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ranking_pontuacao ON public.tb_ranking(pontuacao DESC);
CREATE INDEX IF NOT EXISTS idx_ranking_user_id   ON public.tb_ranking(user_id);

-- ============================================================
-- TABELA: tb_access_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_access_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.tb_users(id) ON DELETE SET NULL,
  username    VARCHAR(50),
  acao        VARCHAR(50) NOT NULL,
  detalhes    JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user_id    ON public.tb_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao       ON public.tb_access_logs(acao);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.tb_access_logs(created_at DESC);

-- ============================================================
-- TRIGGER: Auto-atualização de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tb_users_updated_at ON public.tb_users;
CREATE TRIGGER update_tb_users_updated_at
  BEFORE UPDATE ON public.tb_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tb_ibge_data_updated_at ON public.tb_ibge_data;
CREATE TRIGGER update_tb_ibge_data_updated_at
  BEFORE UPDATE ON public.tb_ibge_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tb_quiz_questions_updated_at ON public.tb_quiz_questions;
CREATE TRIGGER update_tb_quiz_questions_updated_at
  BEFORE UPDATE ON public.tb_quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.tb_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_ibge_data      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_ranking        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_access_logs    ENABLE ROW LEVEL SECURITY;

-- tb_users: qualquer um autenticado pode ler, admin pode tudo
CREATE POLICY "users_read_own" ON public.tb_users
  FOR SELECT USING (auth.uid() = auth_id OR
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "admins_full_users" ON public.tb_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- Permitir INSERT de novo usuário na tb_users ao se cadastrar
CREATE POLICY "insert_own_profile" ON public.tb_users
  FOR INSERT WITH CHECK (true);

-- tb_ibge_data: todos autenticados leem, admin gerencia
CREATE POLICY "authenticated_read_ibge" ON public.tb_ibge_data
  FOR SELECT USING (true);

CREATE POLICY "admins_manage_ibge" ON public.tb_ibge_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- tb_quiz_questions: usuários leem ativas, admin tudo
CREATE POLICY "users_read_active_questions" ON public.tb_quiz_questions
  FOR SELECT USING (ativo = true OR
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "admins_manage_questions" ON public.tb_quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- Permitir INSERT de questões por admin
CREATE POLICY "admins_insert_questions" ON public.tb_quiz_questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- tb_ranking: todos leem, usuário insere próprio
CREATE POLICY "anyone_read_ranking" ON public.tb_ranking
  FOR SELECT USING (true);

CREATE POLICY "users_insert_own_ranking" ON public.tb_ranking
  FOR INSERT WITH CHECK (true);

-- tb_access_logs: admin le, sistema insere
CREATE POLICY "admins_read_logs" ON public.tb_access_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "system_insert_logs" ON public.tb_access_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED: 20 Perguntas do Quiz
-- ============================================================
INSERT INTO public.tb_quiz_questions (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, pontos, dificuldade, categoria, explicacao, ativo) VALUES
('Qual é a população do Brasil segundo o Censo 2022?', '203 milhões', '210 milhões', '192 milhões', '215 milhões', 'C', 100, 'FACIL', 'POPULACAO', 'O Censo 2022 registrou 192 milhões de habitantes, número inferior às projeções anteriores.', true),
('Qual região brasileira tem a maior taxa de frequência escolar no ensino fundamental (6-14 anos)?', 'Sudeste', 'Nordeste', 'Sul', 'Norte', 'C', 100, 'FACIL', 'EDUCACAO', 'A região Sul lidera com 98.5% de frequência no ensino fundamental.', true),
('Qual é a taxa de ocupação das mulheres no Brasil em 2022?', '44,9%', '52,1%', '38,5%', '55,3%', 'A', 150, 'MEDIO', 'TRABALHO', 'A taxa de ocupação feminina é de 44,9%, contra 62,9% dos homens — um gap de 18 p.p.', true),
('Qual meio de transporte é mais usado por mulheres brancas ocupadas no Brasil?', 'Transporte coletivo', 'Automóvel', 'A pé', 'Motocicleta', 'B', 150, 'MEDIO', 'TRANSPORTE', '41,8% das mulheres brancas usam automóvel, enquanto apenas 20,6% das pretas/pardas.', true),
('Qual estado tem a menor taxa de frequência escolar na educação infantil (0-3 anos)?', 'Roraima', 'Amazonas', 'Acre', 'Rondônia', 'B', 150, 'MEDIO', 'EDUCACAO', 'O Amazonas registra apenas 12,6% de frequência para crianças de 0-3 anos.', true),
('Qual é o percentual de pessoas que trabalham no próprio domicílio no Brasil?', '16,6%', '10,2%', '22,5%', '8,3%', 'A', 100, 'FACIL', 'TRABALHO', '16,6% das pessoas ocupadas trabalham no domicílio, sendo 18,9% mulheres e 14,8% homens.', true),
('Qual região tem a maior desigualdade racial no acesso a automóvel?', 'Nordeste', 'Norte', 'Sudeste', 'Centro-Oeste', 'A', 200, 'DIFICIL', 'TRANSPORTE', 'No Nordeste, o gap entre brancos (31,6%) e pretos/pardos (16,9%) é de 14,7 p.p.', true),
('Qual é a taxa de frequência escolar no ensino superior (18-24 anos) para mulheres no Brasil?', '29,7%', '25,7%', '22,3%', '33,5%', 'A', 200, 'DIFICIL', 'EDUCACAO', 'Mulheres têm 29,7% de frequência no ensino superior, contra 25,7% dos homens.', true),
('Em qual região as mulheres indígenas mais andam a pé para o trabalho?', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sul', 'A', 200, 'DIFICIL', 'TRANSPORTE', 'No Norte, 46,8% das mulheres indígenas vão a pé, refletindo a falta de infraestrutura.', true),
('Qual região brasileira tem a maior taxa de ocupação total?', 'Sudeste', 'Sul', 'Centro-Oeste', 'Norte', 'B', 150, 'MEDIO', 'TRABALHO', 'A região Sul lidera com 60,3% de taxa de ocupação, seguida pelo Centro-Oeste com 59,7%.', true),
('Qual é a taxa de frequência escolar de crianças de 4-5 anos no Brasil?', '75,5%', '86,7%', '92,3%', '68,4%', 'B', 150, 'MEDIO', 'EDUCACAO', 'A frequência escolar de 4-5 anos é de 86,7%, com variação regional significativa.', true),
('Qual porcentagem de mulheres pretas/pardas usa transporte coletivo no Brasil?', '25,2%', '34,6%', '20,5%', '40,1%', 'B', 150, 'MEDIO', 'TRANSPORTE', '34,6% das mulheres pretas/pardas usam coletivo, contra 25,2% das brancas.', true),
('Qual é o gap de gênero na taxa de ocupação do Centro-Oeste?', '15,2 p.p.', '19,9 p.p.', '18,1 p.p.', '22,5 p.p.', 'B', 200, 'DIFICIL', 'TRABALHO', 'No Centro-Oeste, homens têm 69,9% e mulheres 50,0% de ocupação — gap de 19,9 p.p.', true),
('Qual estado tem a maior taxa de frequência escolar para o ensino superior (18-24)?', 'São Paulo', 'Santa Catarina', 'Rio Grande do Sul', 'Distrito Federal', 'B', 200, 'DIFICIL', 'EDUCACAO', 'Santa Catarina lidera com média de 30,9% no ensino superior (18-24 anos).', true),
('Qual região tem a maior taxa de trabalho em outro município?', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'A', 150, 'MEDIO', 'TRABALHO', 'No Sudeste, 12,1% trabalham em outro município, refletindo a mobilidade metropolitana.', true),
('No Censo 2022, qual era a taxa de não ocupação no Nordeste?', '44,5%', '54,5%', '51,6%', '39,7%', 'B', 150, 'MEDIO', 'TRABALHO', 'O Nordeste tem a maior taxa de não ocupação: 54,5% da população de 14+ anos.', true),
('Qual é o principal meio de transporte para mulheres indígenas no Brasil?', 'A pé', 'Transporte coletivo', 'Automóvel', 'Motocicleta', 'A', 100, 'FACIL', 'TRANSPORTE', '37,5% das mulheres indígenas vão a pé ao trabalho, o maior percentual entre os grupos.', true),
('Qual região tem a maior frequência escolar na educação infantil (0-5 anos)?', 'Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'B', 150, 'MEDIO', 'EDUCACAO', 'O Nordeste surpreende com altas taxas na educação infantil, especialmente 4-5 anos (89,7%).', true),
('Qual é a porcentagem de homens que trabalham no domicílio no Brasil?', '14,8%', '18,9%', '12,3%', '16,6%', 'A', 150, 'MEDIO', 'TRABALHO', '14,8% dos homens trabalham em casa, contra 18,9% das mulheres.', true),
('No ranking de acesso a automóvel por raça, qual região tem a maior taxa para brancas?', 'Centro-Oeste', 'Sudeste', 'Sul', 'Nordeste', 'C', 200, 'DIFICIL', 'TRANSPORTE', 'No Sul, 48% das mulheres brancas usam automóvel — a maior taxa do país.', true);

-- ============================================================
-- SEED: Dados IBGE de exemplo
-- ============================================================
INSERT INTO public.tb_ibge_data (indicador, descricao, ano, regiao, uf, valor, unidade, categoria, subcategoria) VALUES
('População Total', 'População residente total', 2022, 'Brasil', NULL, 192.0, 'milhões', 'POPULACAO', 'Total'),
('População Total', 'População residente total', 2022, 'Sudeste', NULL, 89.0, 'milhões', 'POPULACAO', 'Total'),
('População Total', 'População residente total', 2022, 'Nordeste', NULL, 57.0, 'milhões', 'POPULACAO', 'Total'),
('População Total', 'População residente total', 2022, 'Sul', NULL, 30.0, 'milhões', 'POPULACAO', 'Total'),
('População Total', 'População residente total', 2022, 'Norte', NULL, 9.5, 'milhões', 'POPULACAO', 'Total'),
('População Total', 'População residente total', 2022, 'Centro-Oeste', NULL, 16.5, 'milhões', 'POPULACAO', 'Total'),
('Taxa de Frequência Escolar', 'Frequência escolar bruta - 6 a 14 anos', 2022, 'Brasil', NULL, 98.26, '%', 'EDUCACAO', 'Ensino Fundamental'),
('Taxa de Ocupação', 'Taxa de ocupação - 14+ anos', 2022, 'Brasil', NULL, 53.53, '%', 'TRABALHO', 'Ocupação'),
('PIB per capita', 'Produto Interno Bruto per capita', 2021, 'Brasil', NULL, 38931.00, 'R$', 'ECONOMIA', 'PIB');
