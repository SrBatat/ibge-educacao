# 🏛️ BLUEPRINT COMPLETO — PORTAL IBGE INTERATIVO
### Sistema Full-Stack: Dashboard de Dados · Quiz Gamificado · Painel Admin
**Plataforma:** Z.ai | **Stack:** React + Tailwind CSS + Lucide Icons + Framer Motion + Supabase  
**Versão do Documento:** 1.0.0 | **Autor:** Arquitetura de Sistemas Z.ai

---

## ÍNDICE

1. [Visão Geral e Arquitetura do Sistema](#1-visão-geral-e-arquitetura-do-sistema)
2. [Design System Gótico Minimalista](#2-design-system-gótico-minimalista)
3. [Configuração da Plataforma Z.ai](#3-configuração-da-plataforma-zai)
4. [Modelagem Completa do Banco de Dados](#4-modelagem-completa-do-banco-de-dados)
5. [Arquitetura de Arquivos e Componentes](#5-arquitetura-de-arquivos-e-componentes)
6. [Fluxo de Autenticação](#6-fluxo-de-autenticação)
7. [Dashboard de Dados do IBGE](#7-dashboard-de-dados-do-ibge)
8. [Módulo de Quiz e Ranking](#8-módulo-de-quiz-e-ranking)
9. [Painel Administrativo](#9-painel-administrativo)
10. [Código-Fonte Completo por Módulo](#10-código-fonte-completo-por-módulo)
11. [Dados Seed e Conteúdo Inicial](#11-dados-seed-e-conteúdo-inicial)
12. [Checklist de Deploy e Validação](#12-checklist-de-deploy-e-validação)

---

## 1. VISÃO GERAL E ARQUITETURA DO SISTEMA

### 1.1 Objetivo do Sistema

Portal web interativo e gamificado voltado à divulgação de dados oficiais do IBGE (Instituto Brasileiro de Geografia e Estatística). O sistema combina três pilares funcionais:

- **Pilar 1 — Visualização de Dados:** Dashboard analítico com dezenas de gráficos e métricas dinâmicas (população, economia, trabalho, curiosidades históricas) baseados em dados reais do IBGE.
- **Pilar 2 — Gamificação:** Sistema de Quiz interativo com cronômetro, feedback visual imediato, pontuação por acerto + tempo e Leaderboard global persistido em banco de dados.
- **Pilar 3 — Administração:** Painel de controle completo (CRUD) para gerenciar usuários, dados do IBGE, perguntas do quiz e logs de auditoria, restrito a usuários com role `ADMIN`.

### 1.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER / CLIENTE                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React SPA (Single Page App)              │   │
│  │  ┌─────────┐  ┌───────────┐  ┌────────┐  ┌───────┐  │   │
│  │  │  Auth   │  │ Dashboard │  │  Quiz  │  │ Admin │  │   │
│  │  │  Pages  │  │  Module   │  │ Module │  │ Panel │  │   │
│  │  └────┬────┘  └─────┬─────┘  └───┬────┘  └───┬───┘  │   │
│  │       └─────────────┴────────────┴────────────┘      │   │
│  │                   React Router v6                     │   │
│  │              Framer Motion (animações)                │   │
│  │          Tailwind CSS (estilização utility-first)     │   │
│  │    Recharts / Victory (gráficos) + Lucide (ícones)   │   │
│  └──────────────────────────┬───────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTPS / REST
┌─────────────────────────────▼───────────────────────────────┐
│                     SUPABASE (Backend)                       │
│  ┌──────────────────┐   ┌───────────────────────────────┐   │
│  │  Auth Service    │   │     PostgreSQL Database        │   │
│  │  (JWT Sessions)  │   │  tb_users · tb_ibge_data      │   │
│  │  Email/Password  │   │  tb_quiz_questions · tb_ranking│   │
│  │  Role-based ACL  │   │  tb_access_logs               │   │
│  └──────────────────┘   └───────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Row Level Security (RLS) Policies                   │   │
│  │  - Usuários só leem seus próprios dados              │   │
│  │  - Admins têm acesso full a todas as tabelas         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Stack Tecnológico Completo

| Camada | Tecnologia | Versão | Finalidade |
|--------|-----------|--------|------------|
| UI Framework | React | 18.x | Componentização e estado |
| Estilização | Tailwind CSS | 3.x | Utility-first CSS |
| Animações | Framer Motion | 11.x | Transições e micro-animações |
| Ícones | Lucide React | Latest | Ícones SVG consistentes |
| Gráficos | Recharts | 2.x | Visualizações de dados |
| Roteamento | React Router | 6.x | SPA com sub-rotas |
| Backend/DB | Supabase | Latest | Auth + PostgreSQL + RLS |
| Estado Global | React Context API | — | Auth state + user data |
| HTTP Client | Supabase JS SDK | 2.x | Queries ao banco |
| Fontes | Google Fonts | — | Cinzel + Inter |

---

## 2. DESIGN SYSTEM GÓTICO MINIMALISTA

### 2.1 Paleta de Cores Completa

```css
/* === IBGE GOTHIC — DESIGN TOKENS === */
:root {
  /* Backgrounds */
  --color-bg-primary:     #0a0a0c;   /* Preto profundo/gótico - fundo principal */
  --color-bg-secondary:   #121216;   /* Grafite escuro - cards e painéis */
  --color-bg-tertiary:    #1a1a22;   /* Grafite médio - inputs, hover states */
  --color-bg-overlay:     #0a0a0ccc; /* Preto translúcido - modais, overlays */

  /* Bordas */
  --color-border-subtle:  #2a2a35;   /* Borda sutil - separadores */
  --color-border-default: #3a3a48;   /* Borda padrão - cards, inputs */
  --color-border-strong:  #52526a;   /* Borda forte - elementos ativos */

  /* Texto */
  --color-text-primary:   #f4f4f5;   /* Branco giz - texto principal */
  --color-text-secondary: #a1a1aa;   /* Cinza mutado - texto secundário */
  --color-text-muted:     #71717a;   /* Cinza escuro - placeholders */
  --color-text-disabled:  #3f3f46;   /* Cinza muito escuro - desabilitado */

  /* Destaques — Vermelho Carmesim */
  --color-crimson-900:    #450a0a;   /* Carmesim mais escuro */
  --color-crimson-700:    #7f1d1d;   /* Carmesim profundo - acento principal */
  --color-crimson-500:    #b91c1c;   /* Carmesim médio - hover */
  --color-crimson-300:    #ef4444;   /* Carmesim claro - alertas */
  --color-crimson-100:    #fee2e2;   /* Carmesim muito claro - backgrounds de erro */

  /* Destaques — Roxo Imperial */
  --color-purple-900:     #2e1065;   /* Roxo mais escuro */
  --color-purple-700:     #581c87;   /* Roxo imperial - acento secundário */
  --color-purple-500:     #7c3aed;   /* Roxo médio - hover */
  --color-purple-300:     #a78bfa;   /* Roxo claro - destaques suaves */

  /* Sucesso (acertos no quiz) */
  --color-success-700:    #14532d;   /* Verde escuro */
  --color-success-500:    #16a34a;   /* Verde médio - feedback correto */
  --color-success-300:    #4ade80;   /* Verde claro */

  /* Gradientes */
  --gradient-crimson:     linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%);
  --gradient-purple:      linear-gradient(135deg, #581c87 0%, #2e1065 100%);
  --gradient-dark:        linear-gradient(180deg, #121216 0%, #0a0a0c 100%);
  --gradient-card-hover:  linear-gradient(135deg, #1a1a22 0%, #121216 100%);

  /* Sombras */
  --shadow-card:          0 4px 24px rgba(0, 0, 0, 0.6);
  --shadow-card-hover:    0 8px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(127, 29, 29, 0.15);
  --shadow-crimson-glow:  0 0 32px rgba(127, 29, 29, 0.4);
  --shadow-purple-glow:   0 0 32px rgba(88, 28, 135, 0.4);

  /* Animações */
  --transition-fast:      150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-default:   250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:      400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring:    500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Tipografia */
  --font-display:         'Cinzel', 'Cormorant Garamond', Georgia, serif;
  --font-body:            'Inter', 'Roboto', system-ui, sans-serif;
  --font-mono:            'JetBrains Mono', 'Fira Code', monospace;

  /* Raios de Borda */
  --radius-sm:            4px;
  --radius-md:            8px;
  --radius-lg:            12px;
  --radius-xl:            16px;
  --radius-full:          9999px;

  /* Espaçamento */
  --spacing-xs:           4px;
  --spacing-sm:           8px;
  --spacing-md:           16px;
  --spacing-lg:           24px;
  --spacing-xl:           32px;
  --spacing-2xl:          48px;
  --spacing-3xl:          64px;
}
```

### 2.2 Configuração Tailwind CSS (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gothic: {
          950: '#0a0a0c',
          900: '#121216',
          800: '#1a1a22',
          700: '#2a2a35',
          600: '#3a3a48',
          500: '#52526a',
        },
        crimson: {
          900: '#450a0a',
          700: '#7f1d1d',
          500: '#b91c1c',
          300: '#ef4444',
          100: '#fee2e2',
        },
        imperial: {
          900: '#2e1065',
          700: '#581c87',
          500: '#7c3aed',
          300: '#a78bfa',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-crimson': 'pulseCrimson 2s ease-in-out infinite',
        'progress-fill': 'progressFill 1s ease-out forwards',
        'number-count': 'numberCount 1.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseCrimson: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(127, 29, 29, 0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(127, 29, 29, 0.3)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(127, 29, 29, 0.15)',
        'crimson-glow': '0 0 32px rgba(127, 29, 29, 0.4)',
        'purple-glow': '0 0 32px rgba(88, 28, 135, 0.4)',
        'inner-subtle': 'inset 0 1px 0 0 rgba(244, 244, 245, 0.05)',
      },
    },
  },
  plugins: [],
};
```

### 2.3 Importação de Fontes (`index.html`)

```html
<!-- No <head> do index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 3. CONFIGURAÇÃO DA PLATAFORMA Z.AI

### 3.1 Dependências do Projeto (`package.json`)

```json
{
  "name": "ibge-gothic-portal",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "framer-motion": "^11.2.0",
    "lucide-react": "^0.383.0",
    "recharts": "^2.12.0",
    "@supabase/supabase-js": "^2.43.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.2.0"
  }
}
```

### 3.2 Variáveis de Ambiente (`.env`)

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=SEU_ANON_KEY_PUBLICO
```

---

## 4. MODELAGEM COMPLETA DO BANCO DE DADOS

### 4.1 Schema PostgreSQL Completo (Executar no Supabase SQL Editor)

```sql
-- ============================================================
-- IBGE GOTHIC PORTAL — DATABASE SCHEMA
-- Execute este bloco completo no Supabase SQL Editor
-- ============================================================

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: tb_users
-- Controla autenticação e níveis de acesso
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,                        -- Gerenciado pelo Supabase Auth
  role          VARCHAR(10) NOT NULL DEFAULT 'USER'
                CHECK (role IN ('USER', 'ADMIN')),
  avatar_url    TEXT,
  is_banned     BOOLEAN NOT NULL DEFAULT FALSE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.tb_users IS 'Tabela principal de usuários do portal IBGE Gothic';
COMMENT ON COLUMN public.tb_users.role IS 'USER = acesso padrão; ADMIN = acesso total ao painel admin';
COMMENT ON COLUMN public.tb_users.is_banned IS 'TRUE = usuário banido, não pode fazer login';

-- ============================================================
-- TABELA: tb_ibge_data
-- Armazena indicadores e dados do IBGE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_ibge_data (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicador     VARCHAR(255) NOT NULL,        -- Ex: "Taxa de Desemprego"
  descricao     TEXT,                         -- Descrição longa do indicador
  ano           SMALLINT NOT NULL,            -- Ex: 2023
  regiao        VARCHAR(50) NOT NULL,         -- Ex: "Nordeste", "Brasil", "SP"
  uf            CHAR(2),                      -- Sigla do estado (nullable)
  valor         NUMERIC(18, 4) NOT NULL,      -- Valor numérico do indicador
  unidade       VARCHAR(30),                  -- Ex: "%", "milhões", "R$"
  categoria     VARCHAR(50) NOT NULL,         -- Ex: "POPULACAO", "ECONOMIA", "TRABALHO"
  subcategoria  VARCHAR(100),                 -- Ex: "Desemprego", "PIB", "Renda"
  fonte         VARCHAR(100) DEFAULT 'IBGE',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance nas queries do dashboard
CREATE INDEX idx_ibge_data_categoria ON public.tb_ibge_data(categoria);
CREATE INDEX idx_ibge_data_regiao    ON public.tb_ibge_data(regiao);
CREATE INDEX idx_ibge_data_ano       ON public.tb_ibge_data(ano);
CREATE INDEX idx_ibge_data_indicador ON public.tb_ibge_data(indicador);

COMMENT ON TABLE public.tb_ibge_data IS 'Dados e indicadores do IBGE para visualização no dashboard';

-- ============================================================
-- TABELA: tb_quiz_questions
-- Banco de perguntas do módulo gamificado
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
  categoria        VARCHAR(50),              -- Ex: "POPULACAO", "HISTORIA", "ECONOMIA"
  explicacao       TEXT,                     -- Explicação exibida após a resposta
  ativo            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_categoria  ON public.tb_quiz_questions(categoria);
CREATE INDEX idx_quiz_dificuldade ON public.tb_quiz_questions(dificuldade);
CREATE INDEX idx_quiz_ativo      ON public.tb_quiz_questions(ativo);

COMMENT ON TABLE public.tb_quiz_questions IS 'Banco de questões do quiz gamificado sobre dados do IBGE';

-- ============================================================
-- TABELA: tb_ranking
-- Leaderboard global do sistema de quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_ranking (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.tb_users(id) ON DELETE CASCADE,
  username        VARCHAR(50) NOT NULL,      -- Desnormalizado para performance
  pontuacao       INTEGER NOT NULL DEFAULT 0,
  total_acertos   SMALLINT NOT NULL DEFAULT 0,
  total_questoes  SMALLINT NOT NULL DEFAULT 0,
  tempo_gasto     INTEGER NOT NULL DEFAULT 0, -- Em segundos
  percentual      NUMERIC(5, 2),             -- Calculado: (acertos/total)*100
  data_tentativa  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para busca rápida do leaderboard
CREATE INDEX idx_ranking_pontuacao     ON public.tb_ranking(pontuacao DESC);
CREATE INDEX idx_ranking_user_id       ON public.tb_ranking(user_id);
CREATE INDEX idx_ranking_data          ON public.tb_ranking(data_tentativa DESC);

COMMENT ON TABLE public.tb_ranking IS 'Leaderboard persistido das tentativas de quiz';

-- ============================================================
-- TABELA: tb_access_logs
-- Auditoria de acessos e eventos do sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tb_access_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.tb_users(id) ON DELETE SET NULL,
  username    VARCHAR(50),
  acao        VARCHAR(50) NOT NULL,          -- Ex: "LOGIN", "LOGOUT", "QUIZ_START"
  detalhes    JSONB,                         -- Informações extras em JSON
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_user_id    ON public.tb_access_logs(user_id);
CREATE INDEX idx_logs_acao       ON public.tb_access_logs(acao);
CREATE INDEX idx_logs_created_at ON public.tb_access_logs(created_at DESC);

COMMENT ON TABLE public.tb_access_logs IS 'Log de auditoria de ações e acessos do sistema';

-- ============================================================
-- TRIGGERS: Auto-atualização de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tb_users_updated_at
  BEFORE UPDATE ON public.tb_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tb_ibge_data_updated_at
  BEFORE UPDATE ON public.tb_ibge_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tb_quiz_questions_updated_at
  BEFORE UPDATE ON public.tb_quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tb_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_ibge_data      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_ranking        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_access_logs    ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA tb_users
CREATE POLICY "users_select_own" ON public.tb_users
  FOR SELECT USING (auth.uid() = auth_id OR 
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "admins_full_access_users" ON public.tb_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- POLÍTICAS PARA tb_ibge_data (todos os autenticados podem ler)
CREATE POLICY "authenticated_read_ibge" ON public.tb_ibge_data
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "admins_manage_ibge" ON public.tb_ibge_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- POLÍTICAS PARA tb_quiz_questions (usuários leem apenas ativas)
CREATE POLICY "users_read_active_questions" ON public.tb_quiz_questions
  FOR SELECT TO authenticated USING (ativo = TRUE);

CREATE POLICY "admins_manage_questions" ON public.tb_quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

-- POLÍTICAS PARA tb_ranking (todos leem, usuário insere o próprio)
CREATE POLICY "anyone_read_ranking" ON public.tb_ranking
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "users_insert_own_ranking" ON public.tb_ranking
  FOR INSERT TO authenticated WITH CHECK (
    user_id IN (SELECT id FROM public.tb_users WHERE auth_id = auth.uid())
  );

-- POLÍTICAS PARA tb_access_logs (apenas admins leem)
CREATE POLICY "admins_read_logs" ON public.tb_access_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.tb_users WHERE auth_id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "system_insert_logs" ON public.tb_access_logs
  FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ============================================================
-- FUNCTION: Busca ranking com posição calculada
-- ============================================================
CREATE OR REPLACE FUNCTION get_ranking_with_position()
RETURNS TABLE (
  posicao      BIGINT,
  id           UUID,
  user_id      UUID,
  username     VARCHAR,
  pontuacao    INTEGER,
  total_acertos SMALLINT,
  total_questoes SMALLINT,
  tempo_gasto  INTEGER,
  percentual   NUMERIC,
  data_tentativa TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY r.pontuacao DESC, r.tempo_gasto ASC) AS posicao,
    r.id, r.user_id, r.username, r.pontuacao,
    r.total_acertos, r.total_questoes, r.tempo_gasto,
    r.percentual, r.data_tentativa
  FROM (
    SELECT DISTINCT ON (rb.user_id) rb.*
    FROM public.tb_ranking rb
    ORDER BY rb.user_id, rb.pontuacao DESC
  ) r
  ORDER BY r.pontuacao DESC, r.tempo_gasto ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. ARQUITETURA DE ARQUIVOS E COMPONENTES

```
src/
├── main.jsx                        # Entry point React + Router
├── App.jsx                         # Componente raiz + ProtectedRoute
│
├── lib/
│   ├── supabase.js                 # Inicialização do Supabase Client
│   └── utils.js                   # Helpers: formatação, cálculos, etc.
│
├── contexts/
│   ├── AuthContext.jsx             # Context + Provider de autenticação
│   └── ThemeContext.jsx            # Context de tema (futuro dark/light)
│
├── hooks/
│   ├── useAuth.js                  # Hook de acesso ao AuthContext
│   ├── useIBGEData.js              # Hook para queries de dados IBGE
│   ├── useQuiz.js                  # Hook de lógica do quiz (estado, timer)
│   └── useRanking.js               # Hook para busca/salvamento de ranking
│
├── components/
│   ├── ui/                         # Componentes atômicos de UI
│   │   ├── Button.jsx              # Botão com variantes (primary/secondary/ghost)
│   │   ├── Card.jsx                # Card container com animação hover
│   │   ├── Input.jsx               # Input estilizado gótico
│   │   ├── Badge.jsx               # Badge de roles/status
│   │   ├── Modal.jsx               # Modal com backdrop e animação
│   │   ├── LoadingSpinner.jsx      # Spinner gótico animado
│   │   ├── ErrorBoundary.jsx       # Captura de erros global
│   │   ├── KPICard.jsx             # Card de métrica com contador animado
│   │   ├── ProgressBar.jsx         # Barra de progresso animada
│   │   └── Tooltip.jsx             # Tooltip flutuante
│   │
│   ├── layout/
│   │   ├── Navbar.jsx              # Barra de navegação principal
│   │   ├── Sidebar.jsx             # Sidebar do painel admin
│   │   ├── PageWrapper.jsx         # Wrapper com animação fade-in-up
│   │   └── Footer.jsx              # Rodapé minimalista
│   │
│   ├── charts/
│   │   ├── LineChartEvolution.jsx  # Gráfico de linha temporal (Recharts)
│   │   ├── BarChartRegional.jsx    # Gráfico de barras por região
│   │   ├── DonutChartDemo.jsx      # Gráfico pizza/donut demográfico
│   │   └── AreaChartGDP.jsx        # Gráfico área para PIB/economia
│   │
│   └── quiz/
│       ├── QuestionCard.jsx        # Card de pergunta com opções
│       ├── Timer.jsx               # Cronômetro regressivo animado
│       ├── ProgressBar.jsx         # Progresso do quiz (Q atual/total)
│       └── ResultCard.jsx          # Tela de resultado final
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx           # Tela de login
│   │   └── RegisterPage.jsx        # Tela de cadastro
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.jsx       # Layout principal com abas
│   │   ├── PopulacaoTab.jsx        # Sub-rota: População e Demografia
│   │   ├── EconomiaTab.jsx         # Sub-rota: Economia e Trabalho
│   │   └── CuriosidadesTab.jsx     # Sub-rota: Curiosidades Históricas
│   │
│   ├── quiz/
│   │   ├── QuizPage.jsx            # Tela do quiz em andamento
│   │   ├── QuizLobbyPage.jsx       # Lobby/intro antes de iniciar
│   │   └── QuizResultPage.jsx      # Resultado + leaderboard
│   │
│   ├── admin/
│   │   ├── AdminLayout.jsx         # Layout do painel admin
│   │   ├── AdminDashboard.jsx      # Overview do painel admin
│   │   ├── AdminUsers.jsx          # CRUD de usuários
│   │   ├── AdminIBGEData.jsx       # Gerenciar dados IBGE
│   │   ├── AdminQuestions.jsx      # Gerenciar perguntas do quiz
│   │   └── AdminLogs.jsx           # Visualizar logs de acesso
│   │
│   └── errors/
│       ├── NotFoundPage.jsx        # Página 404 gótica
│       └── ForbiddenPage.jsx       # Página 403 — Acesso negado
│
└── styles/
    ├── globals.css                 # Tailwind base + CSS vars + resets
    └── animations.css              # Keyframes customizados complementares
```

---

## 6. FLUXO DE AUTENTICAÇÃO

### 6.1 Inicialização do Supabase (`src/lib/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'ibge-gothic-auth',
  },
});
```

### 6.2 Contexto de Autenticação (`src/contexts/AuthContext.jsx`)

```jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);   // Dados do Supabase Auth
  const [profile, setProfile]   = useState(null);   // Dados do tb_users
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Carrega o perfil extendido da tb_users
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setProfile(null); return; }
    const { data, error } = await supabase
      .from('tb_users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();
    if (error) {
      console.error('[AuthContext] Erro ao carregar perfil:', error);
      setProfile(null);
    } else {
      setProfile(data);
      // Atualizar last_login
      await supabase.from('tb_users')
        .update({ last_login: new Date().toISOString() })
        .eq('auth_id', authUser.id);
    }
  }, []);

  useEffect(() => {
    // Sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    // Listener de mudanças de estado auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        await loadProfile(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          await supabase.from('tb_access_logs').insert({
            user_id: profile?.id,
            username: profile?.username,
            acao: 'LOGIN',
          });
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email, password) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return { error }; }
    return { data };
  };

  const signUp = async (email, password, username) => {
    setError(null);
    // 1. Criar conta no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } }
    });
    if (authError) { setError(authError.message); return { error: authError }; }

    // 2. Inserir perfil na tb_users
    const { error: profileError } = await supabase.from('tb_users').insert({
      auth_id: authData.user.id,
      username,
      email,
      role: 'USER',
    });
    if (profileError) { setError(profileError.message); return { error: profileError }; }
    return { data: authData };
  };

  const signOut = async () => {
    await supabase.from('tb_access_logs').insert({
      user_id: profile?.id,
      username: profile?.username,
      acao: 'LOGOUT',
    });
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = () => profile?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};
```

### 6.3 Componente de Rota Protegida (`src/App.jsx`)

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loading para performance
const LoginPage      = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage   = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage  = lazy(() => import('./pages/dashboard/DashboardPage'));
const QuizLobbyPage  = lazy(() => import('./pages/quiz/QuizLobbyPage'));
const QuizPage       = lazy(() => import('./pages/quiz/QuizPage'));
const QuizResultPage = lazy(() => import('./pages/quiz/QuizResultPage'));
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const NotFoundPage   = lazy(() => import('./pages/errors/NotFoundPage'));
const ForbiddenPage  = lazy(() => import('./pages/errors/ForbiddenPage'));

// Guard para rotas autenticadas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Guard para rotas administrativas
function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/403" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/403"      element={<ForbiddenPage />} />
            <Route path="/404"      element={<NotFoundPage />} />

            {/* Rota raiz — redireciona conforme autenticação */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard com sub-rotas */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />

            {/* Quiz */}
            <Route path="/quiz" element={
              <ProtectedRoute><QuizLobbyPage /></ProtectedRoute>
            } />
            <Route path="/quiz/play" element={
              <ProtectedRoute><QuizPage /></ProtectedRoute>
            } />
            <Route path="/quiz/result" element={
              <ProtectedRoute><QuizResultPage /></ProtectedRoute>
            } />

            {/* Painel Admin */}
            <Route path="/admin/*" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### 6.4 Tela de Login (`src/pages/auth/LoginPage.jsx`)

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');
  const { signIn, isAdmin }     = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const { error } = await signIn(email, password);
    if (error) {
      setErr('Credenciais inválidas. Verifique e-mail e senha.');
      setLoading(false);
    } else {
      navigate(isAdmin() ? '/admin' : '/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gothic-950 flex items-center justify-center p-4">
      {/* Ornamento de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-crimson-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-imperial-900/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo / Título */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-4xl font-bold text-white tracking-widest uppercase"
          >
            IBGE
          </motion.h1>
          <p className="font-display text-xs tracking-[0.4em] text-gothic-500 mt-1 uppercase">
            Portal Analítico
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-crimson-700 to-transparent mt-4" />
        </div>

        {/* Card do formulário */}
        <div className="bg-gothic-900 border border-gothic-700/50 rounded-xl p-8 shadow-card">
          <h2 className="font-display text-xl text-white mb-6 tracking-wider">Acesso ao Sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gothic-500 uppercase tracking-widest mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-gothic-600 text-white placeholder-gothic-600
                           py-2 px-0 text-sm focus:outline-none focus:border-crimson-700 transition-colors duration-200"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-medium text-gothic-500 uppercase tracking-widest mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b border-gothic-600 text-white placeholder-gothic-600
                             py-2 px-0 pr-8 text-sm focus:outline-none focus:border-crimson-700 transition-colors duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-0 bottom-2 text-gothic-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {err && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-crimson-300 text-xs bg-crimson-900/30 border border-crimson-700/50 rounded-md p-3"
              >
                <AlertCircle size={14} />
                <span>{err}</span>
              </motion.div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-crimson-700 hover:bg-crimson-500 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-medium text-sm py-3 rounded-lg transition-all duration-200
                         flex items-center justify-center gap-2 shadow-crimson-glow/30 hover:shadow-crimson-glow"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Entrar</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gothic-500">
            Não tem conta?{' '}
            <Link to="/register" className="text-crimson-300 hover:text-white transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
```

---

## 7. DASHBOARD DE DADOS DO IBGE

### 7.1 Layout Principal do Dashboard (`src/pages/dashboard/DashboardPage.jsx`)

```jsx
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Globe, History, Trophy, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import PopulacaoTab from './PopulacaoTab';
import EconomiaTab from './EconomiaTab';
import CuriosidadesTab from './CuriosidadesTab';

const TABS = [
  { path: '',         icon: Globe,    label: 'População e Demografia' },
  { path: 'economia', icon: BarChart3, label: 'Economia e Trabalho' },
  { path: 'historia', icon: History,  label: 'Curiosidades Históricas' },
];

export default function DashboardPage() {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gothic-950 text-white">
      {/* Navbar superior */}
      <Navbar profile={profile} isAdmin={isAdmin()} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-display text-xs tracking-[0.4em] text-gothic-500 uppercase mb-1">
            Instituto Brasileiro de Geografia e Estatística
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide">
            Painel de Dados Nacionais
          </h1>
          <div className="h-px bg-gradient-to-r from-crimson-700 via-imperial-700/50 to-transparent mt-3 w-64" />
        </motion.div>

        {/* Abas de Navegação */}
        <div className="flex gap-1 border-b border-gothic-700 mb-8 overflow-x-auto pb-0 scrollbar-none">
          {TABS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path === '' ? '/dashboard' : `/dashboard/${path}`}
              end={path === ''}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2
                 ${isActive
                   ? 'text-white border-crimson-700 bg-gothic-900/50'
                   : 'text-gothic-500 border-transparent hover:text-white hover:border-gothic-600'
                 }`
              }
            >
              <Icon size={15} />
              <span className="font-body">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Conteúdo das sub-rotas */}
        <Routes>
          <Route index       element={<PopulacaoTab />} />
          <Route path="economia" element={<EconomiaTab />} />
          <Route path="historia" element={<CuriosidadesTab />} />
        </Routes>
      </div>
    </div>
  );
}
```

### 7.2 Aba de População e Demografia (`src/pages/dashboard/PopulacaoTab.jsx`)

```jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MapPin, Baby } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';
import KPICard from '../../components/ui/KPICard';

const COLORS = ['#7f1d1d', '#581c87', '#7c3aed', '#b91c1c', '#a78bfa'];

// Animação para containers de seção
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function PopulacaoTab() {
  const [kpiData, setKpiData]         = useState([]);
  const [lineData, setLineData]       = useState([]);
  const [barData, setBarData]         = useState([]);
  const [pieData, setPieData]         = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tb_ibge_data')
        .select('*')
        .eq('categoria', 'POPULACAO')
        .order('ano', { ascending: true });

      if (!error && data) {
        // KPIs — pegar os valores mais recentes por indicador
        const recentes = {};
        data.forEach(row => {
          if (!recentes[row.indicador] || row.ano > recentes[row.indicador].ano) {
            recentes[row.indicador] = row;
          }
        });
        setKpiData(Object.values(recentes).slice(0, 4));

        // Dados de linha — evolução da população total ao longo dos anos
        const popTotal = data
          .filter(d => d.indicador === 'Populacao Total' && d.regiao === 'Brasil')
          .map(d => ({ ano: String(d.ano), valor: Number(d.valor) }));
        setLineData(popTotal);

        // Dados de barras — população por região no ano mais recente
        const maxAno = Math.max(...data.map(d => d.ano));
        const regioes = data.filter(d => d.ano === maxAno && d.indicador === 'Populacao Total');
        setBarData(regioes.map(d => ({ regiao: d.regiao, valor: Number(d.valor) })));

        // Dados de pizza — distribuição por faixa etária
        const faixas = data.filter(d => d.subcategoria === 'Faixa Etaria' && d.ano === maxAno);
        setPieData(faixas.map(d => ({ name: d.regiao, value: Number(d.valor) })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingGrid />;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* KPIs */}
      <motion.div variants={sectionVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.indicador}
            value={kpi.valor}
            unidade={kpi.unidade}
            ano={kpi.ano}
            icon={[Users, TrendingUp, MapPin, Baby][i]}
          />
        ))}
      </motion.div>

      {/* Gráfico de Linha — Evolução Temporal */}
      <motion.div variants={sectionVariants} className="bg-gothic-900 border border-gothic-700/50 rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-white mb-1 tracking-wider">
          Evolução da População Brasileira
        </h3>
        <p className="text-xs text-gothic-500 mb-6 font-body">Série histórica em milhões de habitantes</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis dataKey="ano" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <YAxis stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#121216', border: '1px solid #3a3a48', borderRadius: 8, color: '#f4f4f5' }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="valor" stroke="#7f1d1d" strokeWidth={2.5}
                  dot={{ fill: '#7f1d1d', r: 4 }} activeDot={{ r: 6, fill: '#ef4444' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Grid: Barras + Pizza */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Barras — Por Região */}
        <motion.div variants={sectionVariants} className="bg-gothic-900 border border-gothic-700/50 rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-white mb-1 tracking-wider">
            Distribuição por Região
          </h3>
          <p className="text-xs text-gothic-500 mb-5 font-body">Participação regional na população total</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" horizontal={false} />
              <XAxis type="number" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
              <YAxis type="category" dataKey="regiao" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: '#121216', border: '1px solid #3a3a48', borderRadius: 8, color: '#f4f4f5' }} />
              <Bar dataKey="valor" fill="#7f1d1d" radius={[0, 4, 4, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pizza — Faixa Etária */}
        <motion.div variants={sectionVariants} className="bg-gothic-900 border border-gothic-700/50 rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-white mb-1 tracking-wider">
            Distribuição por Faixa Etária
          </h3>
          <p className="text-xs text-gothic-500 mb-5 font-body">Composição etária da população brasileira</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                   dataKey="value" paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#121216', border: '1px solid #3a3a48', borderRadius: 8, color: '#f4f4f5' }} />
              <Legend formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LoadingGrid() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gothic-900 rounded-xl border border-gothic-700/30" />
        ))}
      </div>
      <div className="h-80 bg-gothic-900 rounded-xl border border-gothic-700/30" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-72 bg-gothic-900 rounded-xl border border-gothic-700/30" />
        <div className="h-72 bg-gothic-900 rounded-xl border border-gothic-700/30" />
      </div>
    </div>
  );
}
```

### 7.3 Componente KPI Card (`src/components/ui/KPICard.jsx`)

```jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function useCountUp(end, duration = 1500) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const startTime = Date.now();
    const startVal  = 0;
    const endVal    = parseFloat(end) || 0;
    const frame = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      if (ref.current) {
        ref.current.textContent = (startVal + (endVal - startVal) * eased)
          .toLocaleString('pt-BR', { maximumFractionDigits: 1 });
      }
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [end, duration]);
  return ref;
}

export default function KPICard({ label, value, unidade, ano, icon: Icon, accentColor = 'crimson' }) {
  const countRef = useCountUp(value);
  const glowClass = accentColor === 'purple' ? 'group-hover:shadow-purple-glow' : 'group-hover:shadow-crimson-glow';

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group bg-gothic-900 border border-gothic-700/50 hover:border-gothic-600
                  rounded-xl p-5 transition-all duration-300 hover:shadow-card-hover ${glowClass} cursor-default`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-body text-gothic-500 leading-snug pr-2">{label}</p>
        {Icon && (
          <div className={`p-1.5 rounded-md ${accentColor === 'purple' ? 'bg-imperial-900/60 text-imperial-300' : 'bg-crimson-900/60 text-crimson-300'}`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span ref={countRef} className="font-display text-2xl font-bold text-white">
          {parseFloat(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
        </span>
        {unidade && <span className="text-xs text-gothic-500 mb-0.5 font-body">{unidade}</span>}
      </div>
      {ano && <p className="text-xs text-gothic-600 mt-1 font-body">Ref. {ano}</p>}
    </motion.div>
  );
}
```

---

## 8. MÓDULO DE QUIZ E RANKING

### 8.1 Hook de Quiz (`src/hooks/useQuiz.js`)

```javascript
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const TEMPO_POR_QUESTAO = 30; // segundos

export function useQuiz() {
  const [questions, setQuestions]   = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState([]);    // { questionId, chosen, correct, timeSpent }
  const [timeLeft, setTimeLeft]     = useState(TEMPO_POR_QUESTAO);
  const [phase, setPhase]           = useState('LOADING'); // LOADING|PLAYING|ANSWERED|FINISHED
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const timerRef = useRef(null);

  // Buscar questões aleatórias
  const fetchQuestions = useCallback(async (quantidade = 10) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tb_quiz_questions')
      .select('*')
      .eq('ativo', true)
      .limit(quantidade);
    if (!error && data) {
      // Embaralhar questões
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setPhase('PLAYING');
    }
    setLoading(false);
  }, []);

  // Timer regressivo
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentIdx]);

  const handleTimeout = useCallback(() => {
    // Resposta em branco por timeout
    const q = questions[currentIdx];
    setAnswers(prev => [...prev, {
      questionId: q.id,
      chosen: null,
      correct: false,
      timeSpent: TEMPO_POR_QUESTAO,
      pontos: 0,
    }]);
    setSelected('TIMEOUT');
    setPhase('ANSWERED');
  }, [questions, currentIdx]);

  const handleAnswer = useCallback((opcao) => {
    if (phase !== 'PLAYING') return;
    clearInterval(timerRef.current);
    const q = questions[currentIdx];
    const timeSpent = TEMPO_POR_QUESTAO - timeLeft;
    const isCorrect = opcao === q.resposta_correta;
    // Cálculo de pontuação: base do IBGE + bônus de velocidade
    const bonusVelocidade = isCorrect ? Math.max(0, Math.floor((timeLeft / TEMPO_POR_QUESTAO) * 50)) : 0;
    const pontos = isCorrect ? (q.pontos + bonusVelocidade) : 0;

    setSelected(opcao);
    setAnswers(prev => [...prev, { questionId: q.id, chosen: opcao, correct: isCorrect, timeSpent, pontos }]);
    setPhase('ANSWERED');
  }, [phase, questions, currentIdx, timeLeft]);

  const nextQuestion = useCallback(() => {
    const next = currentIdx + 1;
    if (next >= questions.length) {
      setPhase('FINISHED');
    } else {
      setCurrentIdx(next);
      setSelected(null);
      setTimeLeft(TEMPO_POR_QUESTAO);
      setPhase('PLAYING');
    }
  }, [currentIdx, questions.length]);

  // Cálculo do resultado final
  const getResult = useCallback(() => {
    const totalAcertos = answers.filter(a => a.correct).length;
    const pontuacaoTotal = answers.reduce((sum, a) => sum + a.pontos, 0);
    const tempoTotal = answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const percentual = (totalAcertos / questions.length) * 100;
    return { totalAcertos, pontuacaoTotal, tempoTotal, percentual, totalQuestoes: questions.length };
  }, [answers, questions.length]);

  return {
    questions, currentQuestion: questions[currentIdx],
    currentIdx, answers, timeLeft, phase, selected, loading,
    fetchQuestions, handleAnswer, nextQuestion, getResult,
    totalQuestions: questions.length,
    progress: questions.length > 0 ? ((currentIdx) / questions.length) * 100 : 0,
  };
}
```

### 8.2 Página do Quiz em Andamento (`src/pages/quiz/QuizPage.jsx`)

```jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';

const OPCOES = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    currentQuestion, currentIdx, totalQuestions,
    timeLeft, phase, selected, loading, progress,
    fetchQuestions, handleAnswer, nextQuestion, getResult,
  } = useQuiz();

  useEffect(() => {
    fetchQuestions(10);
  }, []);

  useEffect(() => {
    if (phase === 'FINISHED') {
      const result = getResult();
      navigate('/quiz/result', { state: result, replace: true });
    }
  }, [phase]);

  if (loading || !currentQuestion) return <QuizLoadingScreen />;

  const timerPerc = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 10 ? '#7f1d1d' : '#ef4444';

  return (
    <div className="min-h-screen bg-gothic-950 flex flex-col items-center justify-center p-4">
      {/* Barra de progresso geral */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-xs text-gothic-500 mb-1 font-body">
          <span>Questão {currentIdx + 1} de {totalQuestions}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
        <div className="h-1 bg-gothic-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-crimson-700 to-imperial-700"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Card da questão */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-gothic-900 border border-gothic-700/50 rounded-xl p-6 md:p-8 shadow-card">
            {/* Cronômetro */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-gothic-500 uppercase tracking-widest font-display">
                {currentQuestion.categoria || 'Geral'}
              </span>
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: timerColor }} />
                <span
                  className="font-mono text-lg font-bold tabular-nums"
                  style={{ color: timerColor }}
                >
                  {String(timeLeft).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Barra de tempo visual */}
            <div className="h-1 bg-gothic-800 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all"
                style={{ width: `${timerPerc}%`, background: timerColor }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Texto da pergunta */}
            <p className="font-body text-lg text-white leading-relaxed mb-8">
              {currentQuestion.pergunta}
            </p>

            {/* Opções de resposta */}
            <div className="grid gap-3">
              {OPCOES.map(opcao => {
                const texto = currentQuestion[`opcao_${opcao.toLowerCase()}`];
                let style = 'border-gothic-700/50 hover:border-gothic-600 hover:bg-gothic-800/50';
                let icon  = null;
                if (selected) {
                  if (opcao === currentQuestion.resposta_correta) {
                    style = 'border-green-700 bg-green-950/40';
                    icon = <CheckCircle2 size={16} className="text-green-400 ml-auto" />;
                  } else if (opcao === selected && opcao !== currentQuestion.resposta_correta) {
                    style = 'border-crimson-700 bg-crimson-950/40';
                    icon = <XCircle size={16} className="text-crimson-300 ml-auto" />;
                  } else {
                    style = 'border-gothic-700/30 opacity-50';
                  }
                }
                return (
                  <button
                    key={opcao}
                    onClick={() => handleAnswer(opcao)}
                    disabled={!!selected}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border
                                transition-all duration-200 ${style}
                                ${!selected ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-md border border-gothic-600 flex items-center justify-center
                                     text-xs font-mono font-bold text-gothic-400">
                      {opcao}
                    </span>
                    <span className="font-body text-sm text-white">{texto}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explicação após responder */}
            {selected && currentQuestion.explicacao && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 bg-gothic-800/50 border border-gothic-700/50 rounded-lg"
              >
                <p className="text-xs text-gothic-500 uppercase tracking-widest mb-1 font-display">Sabia mais?</p>
                <p className="text-sm text-gothic-300 font-body leading-relaxed">{currentQuestion.explicacao}</p>
              </motion.div>
            )}

            {/* Botão Próxima */}
            {selected && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={nextQuestion}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-crimson-700
                           hover:bg-crimson-500 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                {currentIdx + 1 >= totalQuestions ? 'Ver Resultado' : 'Próxima Questão'}
                <ArrowRight size={15} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuizLoadingScreen() {
  return (
    <div className="min-h-screen bg-gothic-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gothic-700 border-t-crimson-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display text-gothic-500 text-sm tracking-widest uppercase">Carregando Questões</p>
      </div>
    </div>
  );
}
```

### 8.3 Tela de Resultado e Leaderboard (`src/pages/quiz/QuizResultPage.jsx`)

```jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock, RefreshCw, Home, Medal } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const POSICAO_ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function QuizResultPage() {
  const { state }       = useLocation();
  const { profile }     = useAuth();
  const navigate        = useNavigate();
  const [ranking, setRanking]   = useState([]);
  const [meuRank, setMeuRank]   = useState(null);
  const [saved, setSaved]       = useState(false);

  const result = state || { totalAcertos: 0, pontuacaoTotal: 0, tempoTotal: 0, percentual: 0, totalQuestoes: 10 };

  // Salvar resultado e buscar ranking
  useEffect(() => {
    if (!profile || saved) return;
    async function saveAndFetch() {
      // Salvar no banco
      await supabase.from('tb_ranking').insert({
        user_id:        profile.id,
        username:       profile.username,
        pontuacao:      result.pontuacaoTotal,
        total_acertos:  result.totalAcertos,
        total_questoes: result.totalQuestoes,
        tempo_gasto:    result.tempoTotal,
        percentual:     result.percentual,
      });
      setSaved(true);

      // Buscar leaderboard
      const { data } = await supabase.rpc('get_ranking_with_position');
      if (data) {
        setRanking(data.slice(0, 10));
        const minhaPos = data.findIndex(r => r.user_id === profile.id);
        setMeuRank(minhaPos >= 0 ? data[minhaPos] : null);
      }
    }
    saveAndFetch();
  }, [profile]);

  const categoriaResultado = () => {
    const p = result.percentual;
    if (p === 100) return { label: 'Perfeito!', color: 'text-yellow-400' };
    if (p >= 80) return { label: 'Excelente!', color: 'text-green-400' };
    if (p >= 60) return { label: 'Bom!', color: 'text-imperial-300' };
    if (p >= 40) return { label: 'Regular', color: 'text-gothic-400' };
    return { label: 'Tente Novamente', color: 'text-crimson-300' };
  };

  const { label, color } = categoriaResultado();

  return (
    <div className="min-h-screen bg-gothic-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Resultado Pessoal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gothic-900 border border-gothic-700/50 rounded-2xl p-8 text-center mb-8 shadow-card"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-crimson-900/40 border border-crimson-700/50 mb-4">
            <Trophy size={28} className="text-crimson-300" />
          </div>
          <h1 className={`font-display text-4xl font-bold mb-1 ${color}`}>{label}</h1>
          <p className="text-gothic-500 text-sm font-body mb-6">Quiz concluído — Resultados registrados</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { icon: Star, label: 'Pontuação', value: result.pontuacaoTotal.toLocaleString('pt-BR'), color: 'text-yellow-400' },
              { icon: Medal, label: 'Acertos', value: `${result.totalAcertos}/${result.totalQuestoes}`, color: 'text-green-400' },
              { icon: Clock, label: 'Tempo', value: `${result.tempoTotal}s`, color: 'text-imperial-300' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-gothic-800/60 rounded-xl p-4">
                <Icon size={18} className={`${color} mx-auto mb-2`} />
                <div className={`font-display text-xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gothic-500 mt-0.5 font-body">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gothic-900 border border-gothic-700/50 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gothic-700/50">
            <h2 className="font-display text-xl font-bold text-white tracking-wider">
              Tabela de Classificação
            </h2>
            <p className="text-xs text-gothic-500 mt-1 font-body">Top 10 — melhor pontuação por usuário</p>
          </div>

          <div className="divide-y divide-gothic-700/30">
            {ranking.map((row, i) => {
              const isMe = row.user_id === profile?.id;
              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors
                    ${isMe ? 'bg-crimson-950/30 border-l-2 border-crimson-700' : 'hover:bg-gothic-800/30'}`}
                >
                  {/* Posição */}
                  <div className="w-10 text-center">
                    {POSICAO_ICONS[row.posicao] || (
                      <span className="font-mono text-sm text-gothic-500">#{row.posicao}</span>
                    )}
                  </div>
                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm font-medium truncate ${isMe ? 'text-crimson-300' : 'text-white'}`}>
                      {row.username} {isMe && <span className="text-xs text-gothic-500 ml-1">(você)</span>}
                    </p>
                    <p className="text-xs text-gothic-500">
                      {row.total_acertos}/{row.total_questoes} acertos · {row.tempo_gasto}s
                    </p>
                  </div>
                  {/* Pontuação */}
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-yellow-400">
                      {row.pontuacao.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gothic-500">{row.percentual?.toFixed(0)}%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Ações */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/quiz', { replace: true })}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-crimson-700 hover:bg-crimson-500
                       text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={15} /> Jogar Novamente
          </button>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gothic-700
                       hover:bg-gothic-800 text-gothic-400 hover:text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Home size={15} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. PAINEL ADMINISTRATIVO

### 9.1 Layout do Admin (`src/pages/admin/AdminLayout.jsx`)

```jsx
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Database, HelpCircle, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard  from './AdminDashboard';
import AdminUsers      from './AdminUsers';
import AdminIBGEData   from './AdminIBGEData';
import AdminQuestions  from './AdminQuestions';
import AdminLogs       from './AdminLogs';

const NAV = [
  { path: '/admin',            icon: LayoutDashboard, label: 'Visão Geral',     end: true },
  { path: '/admin/users',      icon: Users,           label: 'Usuários' },
  { path: '/admin/ibge',       icon: Database,        label: 'Dados IBGE' },
  { path: '/admin/questions',  icon: HelpCircle,      label: 'Perguntas Quiz' },
  { path: '/admin/logs',       icon: FileText,        label: 'Logs de Acesso' },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gothic-950 text-white">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-gothic-900 border-r border-gothic-700/50 flex flex-col">
        {/* Logo Admin */}
        <div className="p-6 border-b border-gothic-700/50">
          <p className="font-display text-xs tracking-[0.4em] text-gothic-500 uppercase">Admin</p>
          <h2 className="font-display text-xl font-bold text-white mt-0.5 tracking-wide">IBGE Portal</h2>
          <div className="inline-flex items-center gap-1.5 mt-3 px-2 py-0.5 bg-crimson-900/40 border border-crimson-700/50 rounded-full">
            <span className="w-1.5 h-1.5 bg-crimson-400 rounded-full animate-pulse" />
            <span className="text-xs text-crimson-300 font-body">
              {profile?.username || 'Admin'}
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200
                 ${isActive
                   ? 'bg-crimson-900/40 text-crimson-300 border border-crimson-700/50'
                   : 'text-gothic-500 hover:text-white hover:bg-gothic-800'
                 }`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gothic-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gothic-500
                       hover:text-crimson-300 hover:bg-crimson-950/30 transition-all duration-200 font-body"
          >
            <LogOut size={15} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área de conteúdo */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index                element={<AdminDashboard />} />
          <Route path="users"         element={<AdminUsers />} />
          <Route path="ibge"          element={<AdminIBGEData />} />
          <Route path="questions"     element={<AdminQuestions />} />
          <Route path="logs"          element={<AdminLogs />} />
        </Routes>
      </main>
    </div>
  );
}
```

### 9.2 CRUD de Usuários Admin (`src/pages/admin/AdminUsers.jsx`)

```jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldOff, Trash2, RefreshCw, UserX, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tb_users')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    await supabase.from('tb_users').update({ role: newRole }).eq('id', user.id);
    fetchUsers();
  };

  const toggleBan = async (user) => {
    await supabase.from('tb_users').update({ is_banned: !user.is_banned }).eq('id', user.id);
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    if (!confirm('Confirma a exclusão permanente deste usuário?')) return;
    await supabase.from('tb_users').delete().eq('id', userId);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Gerenciar Usuários</h1>
          <p className="text-sm text-gothic-500 mt-1 font-body">{users.length} usuários cadastrados</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 border border-gothic-700 hover:bg-gothic-800 text-gothic-400 hover:text-white text-sm rounded-lg transition-colors"
        >
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      {/* Busca */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por username ou email..."
        className="w-full mb-6 bg-gothic-900 border border-gothic-700 text-white text-sm px-4 py-2.5
                   rounded-lg placeholder-gothic-600 focus:outline-none focus:border-crimson-700 transition-colors"
      />

      {/* Tabela */}
      <div className="bg-gothic-900 border border-gothic-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gothic-700/50">
              {['Username', 'E-mail', 'Role', 'Status', 'Cadastro', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-body font-medium text-gothic-500 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gothic-700/30">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gothic-600 font-body">Carregando...</td></tr>
            ) : filtered.map(user => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gothic-800/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-white font-body">{user.username}</td>
                <td className="px-4 py-3 text-gothic-400 font-body">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-body font-medium
                    ${user.role === 'ADMIN'
                      ? 'bg-imperial-900/60 text-imperial-300 border border-imperial-700/50'
                      : 'bg-gothic-800 text-gothic-400 border border-gothic-700'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-body font-medium
                    ${user.is_banned
                      ? 'bg-crimson-900/60 text-crimson-300 border border-crimson-700/50'
                      : 'bg-green-950/60 text-green-400 border border-green-900/50'
                    }`}>
                    {user.is_banned ? 'Banido' : 'Ativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gothic-500 font-body text-xs">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRole(user)}
                      title={user.role === 'ADMIN' ? 'Remover Admin' : 'Tornar Admin'}
                      className="p-1.5 text-gothic-500 hover:text-imperial-300 hover:bg-imperial-900/30 rounded-md transition-colors"
                    >
                      {user.role === 'ADMIN' ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                    <button
                      onClick={() => toggleBan(user)}
                      title={user.is_banned ? 'Desbanir' : 'Banir'}
                      className="p-1.5 text-gothic-500 hover:text-crimson-300 hover:bg-crimson-900/30 rounded-md transition-colors"
                    >
                      {user.is_banned ? <UserCheck size={14} /> : <UserX size={14} />}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      title="Excluir usuário"
                      className="p-1.5 text-gothic-500 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 9.3 CRUD de Perguntas do Quiz (`src/pages/admin/AdminQuestions.jsx`)

```jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const EMPTY_FORM = {
  pergunta: '', opcao_a: '', opcao_b: '', opcao_c: '', opcao_d: '',
  resposta_correta: 'A', pontos: 100, dificuldade: 'MEDIO',
  categoria: 'GERAL', explicacao: '', ativo: true,
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [err, setErr]             = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await supabase.from('tb_quiz_questions').select('*').order('created_at', { ascending: false });
    setQuestions(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchQuestions(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErr('');
    setModal(true);
  };

  const openEdit = (q) => {
    setEditing(q.id);
    setForm({ ...q });
    setErr('');
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.pergunta || !form.opcao_a || !form.opcao_b || !form.opcao_c || !form.opcao_d) {
      setErr('Preencha todos os campos obrigatórios.');
      return;
    }
    setSaving(true);
    if (editing) {
      await supabase.from('tb_quiz_questions').update(form).eq('id', editing);
    } else {
      await supabase.from('tb_quiz_questions').insert(form);
    }
    setSaving(false);
    setModal(false);
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta pergunta permanentemente?')) return;
    await supabase.from('tb_quiz_questions').delete().eq('id', id);
    fetchQuestions();
  };

  const INPUT_CLASS = "w-full bg-gothic-950 border border-gothic-700 text-white text-sm px-3 py-2 rounded-lg placeholder-gothic-600 focus:outline-none focus:border-crimson-700 transition-colors";
  const LABEL_CLASS = "block text-xs text-gothic-500 uppercase tracking-widest font-body mb-1";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Perguntas do Quiz</h1>
          <p className="text-sm text-gothic-500 mt-1 font-body">{questions.length} questões cadastradas</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-crimson-700 hover:bg-crimson-500 text-white text-sm rounded-lg transition-colors"
        >
          <Plus size={15} /> Nova Pergunta
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gothic-600 font-body">Carregando...</div>
        ) : questions.map(q => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4 p-4 bg-gothic-900 border border-gothic-700/50 rounded-xl hover:border-gothic-600 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-body font-medium leading-snug line-clamp-2">{q.pergunta}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs text-gothic-500 font-body">
                  Resp: <span className="text-green-400 font-mono font-bold">{q.resposta_correta}</span>
                </span>
                <span className="text-gothic-700">·</span>
                <span className="text-xs text-gothic-500 font-body">{q.pontos} pts</span>
                <span className="text-gothic-700">·</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-body
                  ${q.dificuldade === 'FACIL' ? 'bg-green-950/50 text-green-400'
                    : q.dificuldade === 'DIFICIL' ? 'bg-crimson-950/50 text-crimson-300'
                    : 'bg-gothic-800 text-gothic-400'}`}>
                  {q.dificuldade}
                </span>
                {!q.ativo && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gothic-800 text-gothic-600 font-body">Inativa</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => openEdit(q)} className="p-2 text-gothic-500 hover:text-imperial-300 hover:bg-imperial-900/30 rounded-md transition-colors">
                <Edit3 size={14} />
              </button>
              <button onClick={() => handleDelete(q.id)} className="p-2 text-gothic-500 hover:text-crimson-300 hover:bg-crimson-900/30 rounded-md transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de Edição */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gothic-900 border border-gothic-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white tracking-wide">
                  {editing ? 'Editar Pergunta' : 'Nova Pergunta'}
                </h2>
                <button onClick={() => setModal(false)} className="text-gothic-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLASS}>Pergunta *</label>
                  <textarea
                    value={form.pergunta}
                    onChange={e => setForm(f => ({ ...f, pergunta: e.target.value }))}
                    rows={3}
                    className={INPUT_CLASS + ' resize-none'}
                    placeholder="Digite a pergunta aqui..."
                  />
                </div>

                {['A', 'B', 'C', 'D'].map(op => (
                  <div key={op}>
                    <label className={LABEL_CLASS}>Opção {op} *</label>
                    <input
                      type="text"
                      value={form[`opcao_${op.toLowerCase()}`]}
                      onChange={e => setForm(f => ({ ...f, [`opcao_${op.toLowerCase()}`]: e.target.value }))}
                      className={INPUT_CLASS}
                      placeholder={`Texto da opção ${op}...`}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Resp. Correta *</label>
                    <select value={form.resposta_correta} onChange={e => setForm(f => ({ ...f, resposta_correta: e.target.value }))}
                      className={INPUT_CLASS}>
                      {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Pontos</label>
                    <input type="number" value={form.pontos} onChange={e => setForm(f => ({ ...f, pontos: Number(e.target.value) }))}
                      className={INPUT_CLASS} min={10} max={500} step={10} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Dificuldade</label>
                    <select value={form.dificuldade} onChange={e => setForm(f => ({ ...f, dificuldade: e.target.value }))}
                      className={INPUT_CLASS}>
                      {['FACIL', 'MEDIO', 'DIFICIL'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASS}>Explicação (exibida após responder)</label>
                  <textarea
                    value={form.explicacao}
                    onChange={e => setForm(f => ({ ...f, explicacao: e.target.value }))}
                    rows={2}
                    className={INPUT_CLASS + ' resize-none'}
                    placeholder="Informação extra para enriquecer o aprendizado..."
                  />
                </div>

                {err && (
                  <div className="flex items-center gap-2 text-crimson-300 text-xs bg-crimson-900/30 border border-crimson-700/50 rounded-lg p-3">
                    <AlertCircle size={14} /> {err}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-crimson-700 hover:bg-crimson-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><Check size={15} /> Salvar</>}
                  </button>
                  <button onClick={() => setModal(false)} className="px-6 py-2.5 border border-gothic-700 hover:bg-gothic-800 text-gothic-400 text-sm rounded-lg transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 9.4 Página 403 — Acesso Negado (`src/pages/errors/ForbiddenPage.jsx`)

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gothic-950 flex items-center justify-center p-4">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20rem] font-display font-bold text-gothic-900/20 select-none leading-none">
          403
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-crimson-900/30 border border-crimson-700/50 mb-6">
          <ShieldX size={36} className="text-crimson-300" />
        </div>

        <p className="font-display text-xs tracking-[0.5em] text-crimson-700 uppercase mb-3">
          Acesso Negado
        </p>
        <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-wide">403</h1>
        <p className="font-body text-gothic-400 text-sm leading-relaxed mb-8">
          Você não possui autorização para acessar este recurso.<br />
          Apenas administradores do sistema têm permissão para esta área.
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-crimson-900 to-transparent mb-8" />

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gothic-900 hover:bg-gothic-800 border border-gothic-700 hover:border-gothic-600 text-white text-sm font-body rounded-lg transition-all duration-200"
        >
          <ArrowLeft size={15} /> Voltar ao Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
```

---

## 10. CÓDIGO-FONTE COMPLETO POR MÓDULO

### 10.1 Navbar Principal (`src/components/layout/Navbar.jsx`)

```jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Trophy, Settings, LogOut, Menu, X, User } from 'lucide-react';

export default function Navbar({ profile, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/quiz',      icon: Trophy,    label: 'Quiz' },
    ...(isAdmin ? [{ to: '/admin', icon: Settings, label: 'Admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gothic-900/80 backdrop-blur-md border-b border-gothic-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="font-display text-lg font-bold text-white tracking-wider">IBGE</span>
            <span className="hidden sm:block text-xs text-gothic-500 font-body tracking-widest uppercase border-l border-gothic-700 pl-2.5">
              Portal Analítico
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-200
                    ${active
                      ? 'bg-crimson-900/40 text-crimson-300 border border-crimson-700/40'
                      : 'text-gothic-500 hover:text-white hover:bg-gothic-800'
                    }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuário + Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gothic-800/60 rounded-full border border-gothic-700/50">
              <User size={13} className="text-gothic-500" />
              <span className="text-xs text-gothic-400 font-body max-w-[100px] truncate">{profile?.username}</span>
              {isAdmin && (
                <span className="text-xs px-1.5 bg-imperial-900/60 text-imperial-300 border border-imperial-700/50 rounded-full font-body">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gothic-500 hover:text-crimson-300 hover:bg-crimson-950/30 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut size={15} />
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 text-gothic-500 hover:text-white rounded-lg transition-colors"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-gothic-700/50 bg-gothic-900"
          >
            <div className="p-3 space-y-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gothic-400 hover:text-white hover:bg-gothic-800 transition-colors font-body"
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

### 10.2 Spinner de Carregamento (`src/components/ui/LoadingSpinner.jsx`)

```jsx
import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 32 }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Anel externo */}
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full border-2 border-gothic-800"
          style={{ width: size, height: size }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-crimson-700 animate-spin"
          style={{ width: size, height: size }}
        />
        {/* Ponto central */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-crimson-700 rounded-full"
        />
      </div>
      <p className="font-display text-xs tracking-[0.4em] text-gothic-600 uppercase">
        Carregando
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-gothic-950 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  return spinner;
}
```

---

## 11. DADOS SEED E CONTEÚDO INICIAL

### 11.1 SQL: Dados IBGE para Seed (Copiar no Supabase SQL Editor)

```sql
-- ============================================================
-- SEED: Dados IBGE — Executar após criar o schema
-- ============================================================

-- === POPULAÇÃO ===
INSERT INTO public.tb_ibge_data (indicador, descricao, ano, regiao, valor, unidade, categoria, subcategoria) VALUES
('Populacao Total', 'População residente total estimada', 2022, 'Brasil', 215313498, 'hab', 'POPULACAO', 'Total'),
('Populacao Total', 'População residente total estimada', 2010, 'Brasil', 190755799, 'hab', 'POPULACAO', 'Total'),
('Populacao Total', 'População residente total estimada', 2000, 'Brasil', 169590693, 'hab', 'POPULACAO', 'Total'),
('Populacao Total', 'População residente total estimada', 1991, 'Brasil', 146825475, 'hab', 'POPULACAO', 'Total'),
('Populacao Total', 'População residente total estimada', 1980, 'Brasil', 119002706, 'hab', 'POPULACAO', 'Total'),

-- Por região (2022)
('Populacao Total', 'Região Norte', 2022, 'Norte', 18430980, 'hab', 'POPULACAO', 'Regional'),
('Populacao Total', 'Região Nordeste', 2022, 'Nordeste', 54644582, 'hab', 'POPULACAO', 'Regional'),
('Populacao Total', 'Região Sudeste', 2022, 'Sudeste', 88371433, 'hab', 'POPULACAO', 'Regional'),
('Populacao Total', 'Região Sul', 2022, 'Sul', 29974256, 'hab', 'POPULACAO', 'Regional'),
('Populacao Total', 'Região Centro-Oeste', 2022, 'Centro-Oeste', 16287080, 'hab', 'POPULACAO', 'Regional'),

-- Faixas etárias (Brasil, 2022)
('Faixa 0-14', 'População de 0 a 14 anos', 2022, '0-14 anos', 19.8, '%', 'POPULACAO', 'Faixa Etaria'),
('Faixa 15-29', 'População de 15 a 29 anos', 2022, '15-29 anos', 22.1, '%', 'POPULACAO', 'Faixa Etaria'),
('Faixa 30-59', 'População de 30 a 59 anos', 2022, '30-59 anos', 39.5, '%', 'POPULACAO', 'Faixa Etaria'),
('Faixa 60+', 'População de 60 anos ou mais', 2022, '60+ anos', 15.6, '%', 'POPULACAO', 'Faixa Etaria'),
('Faixa 80+', 'População de 80 anos ou mais', 2022, '80+ anos', 3.0, '%', 'POPULACAO', 'Faixa Etaria'),

-- KPIs populacionais
('Densidade Demografica', 'Hab por km²', 2022, 'Brasil', 25.3, 'hab/km²', 'POPULACAO', 'KPI'),
('Taxa de Urbanizacao', 'Percentual da população em área urbana', 2022, 'Brasil', 87.1, '%', 'POPULACAO', 'KPI'),
('Taxa de Crescimento', 'Crescimento anual médio', 2022, 'Brasil', 0.52, '%/ano', 'POPULACAO', 'KPI');

-- === ECONOMIA ===
INSERT INTO public.tb_ibge_data (indicador, descricao, ano, regiao, valor, unidade, categoria, subcategoria) VALUES
('PIB Total', 'Produto Interno Bruto', 2023, 'Brasil', 10.91, 'trilhões R$', 'ECONOMIA', 'PIB'),
('PIB Total', 'Produto Interno Bruto', 2022, 'Brasil', 9.91, 'trilhões R$', 'ECONOMIA', 'PIB'),
('PIB Total', 'Produto Interno Bruto', 2021, 'Brasil', 8.68, 'trilhões R$', 'ECONOMIA', 'PIB'),
('PIB Total', 'Produto Interno Bruto', 2020, 'Brasil', 7.61, 'trilhões R$', 'ECONOMIA', 'PIB'),
('PIB Total', 'Produto Interno Bruto', 2019, 'Brasil', 7.39, 'trilhões R$', 'ECONOMIA', 'PIB'),
('PIB Per Capita', 'PIB per capita em R$', 2023, 'Brasil', 51008, 'R$', 'ECONOMIA', 'PIB'),
('Inflacao IPCA', 'IPCA acumulado anual', 2023, 'Brasil', 4.62, '%', 'ECONOMIA', 'Inflacao'),
('Inflacao IPCA', 'IPCA acumulado anual', 2022, 'Brasil', 5.79, '%', 'ECONOMIA', 'Inflacao'),
('Inflacao IPCA', 'IPCA acumulado anual', 2021, 'Brasil', 10.06, '%', 'ECONOMIA', 'Inflacao');

-- === TRABALHO ===
INSERT INTO public.tb_ibge_data (indicador, descricao, ano, regiao, valor, unidade, categoria, subcategoria) VALUES
('Taxa Desemprego', 'Taxa de desocupação PNAD', 2024, 'Brasil', 6.2, '%', 'TRABALHO', 'Desemprego'),
('Taxa Desemprego', 'Taxa de desocupação PNAD', 2023, 'Brasil', 7.8, '%', 'TRABALHO', 'Desemprego'),
('Taxa Desemprego', 'Taxa de desocupação PNAD', 2022, 'Brasil', 9.3, '%', 'TRABALHO', 'Desemprego'),
('Taxa Desemprego', 'Taxa de desocupação PNAD', 2021, 'Brasil', 13.2, '%', 'TRABALHO', 'Desemprego'),
('Taxa Desemprego', 'Taxa de desocupação PNAD', 2020, 'Brasil', 13.5, '%', 'TRABALHO', 'Desemprego'),
('Taxa Desemprego', 'Por Região', 2023, 'Nordeste', 11.4, '%', 'TRABALHO', 'Regional'),
('Taxa Desemprego', 'Por Região', 2023, 'Sudeste', 7.1, '%', 'TRABALHO', 'Regional'),
('Renda Media', 'Renda domiciliar per capita', 2023, 'Brasil', 1682, 'R$/mês', 'TRABALHO', 'Renda'),
('Salario Minimo', 'Salário mínimo vigente', 2024, 'Brasil', 1412, 'R$', 'TRABALHO', 'Salario');
```

### 11.2 SQL: Perguntas do Quiz para Seed

```sql
-- ============================================================
-- SEED: Banco de Questões do Quiz
-- ============================================================
INSERT INTO public.tb_quiz_questions
  (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, pontos, dificuldade, categoria, explicacao)
VALUES
-- POPULACAO
('Qual foi a população do Brasil no Censo de 2022?',
 '215 milhões', '190 milhões', '230 milhões', '180 milhões',
 'A', 100, 'FACIL', 'POPULACAO',
 'O Censo 2022 do IBGE contabilizou 215.313.498 habitantes no Brasil.'),

('Qual região brasileira possui a maior densidade demográfica?',
 'Norte', 'Nordeste', 'Sudeste', 'Centro-Oeste',
 'C', 100, 'FACIL', 'POPULACAO',
 'O Sudeste tem cerca de 88 milhões de habitantes em apenas 11% do território nacional.'),

('Em qual ano o Brasil superou 100 milhões de habitantes?',
 '1960', '1970', '1975', '1980',
 'C', 150, 'MEDIO', 'POPULACAO',
 'O Brasil atingiu 100 milhões de habitantes por volta de 1972-1975, confirmado pelos dados do IBGE.'),

-- ECONOMIA
('Qual o valor aproximado do PIB brasileiro em 2023?',
 'R$ 7,5 trilhões', 'R$ 8,9 trilhões', 'R$ 10,9 trilhões', 'R$ 12,3 trilhões',
 'C', 150, 'MEDIO', 'ECONOMIA',
 'O PIB do Brasil em 2023 foi de aproximadamente R$ 10,9 trilhões, tornando o Brasil a maior economia da América Latina.'),

('Em qual ano a inflação brasileira (IPCA) superou 10%?',
 '2019', '2020', '2021', '2022',
 'C', 150, 'MEDIO', 'ECONOMIA',
 'Em 2021, o IPCA acumulou 10,06% de inflação, reflexo de pressões cambiais e da pandemia de COVID-19.'),

('O Brasil é a maior economia da América Latina. Em qual posição está no ranking mundial do PIB?',
 '7ª', '9ª', '11ª', '13ª',
 'B', 200, 'DIFICIL', 'ECONOMIA',
 'O Brasil ocupa a 9ª posição no ranking mundial de PIB nominal, segundo o FMI.'),

-- TRABALHO
('Qual foi a taxa de desemprego no Brasil no 1º trimestre de 2024?',
 '9,2%', '7,8%', '6,2%', '11,4%',
 'C', 100, 'FACIL', 'TRABALHO',
 'A taxa de desocupação caiu para 6,2% no início de 2024, o menor patamar desde 2012.'),

('Qual região brasileira registrou a maior taxa de desemprego em 2023?',
 'Norte', 'Nordeste', 'Centro-Oeste', 'Sul',
 'B', 100, 'FACIL', 'TRABALHO',
 'O Nordeste registrou 11,4% de desemprego em 2023, o maior entre as regiões brasileiras.'),

-- HISTORIA / CURIOSIDADES
('Em que ano foi fundado o IBGE?',
 '1934', '1936', '1938', '1942',
 'C', 150, 'MEDIO', 'HISTORIA',
 'O IBGE foi criado em 1938, durante o Estado Novo, com a missão de produzir informações geográficas e estatísticas do Brasil.'),

('Qual foi o primeiro Censo Demográfico realizado no Brasil?',
 '1872', '1890', '1900', '1920',
 'A', 200, 'DIFICIL', 'HISTORIA',
 'O primeiro Censo Demográfico do Brasil foi realizado em 1872, durante o Segundo Reinado, e contabilizou 9.930.478 habitantes.'),

('Qual estado brasileiro tem a maior área territorial?',
 'Mato Grosso', 'Pará', 'Amazonas', 'Mato Grosso do Sul',
 'C', 100, 'FACIL', 'HISTORIA',
 'O Amazonas é o maior estado do Brasil com 1.571.000 km², representando 18,4% do território nacional.'),

('Qual município brasileiro tem a maior população?',
 'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador',
 'B', 100, 'FACIL', 'POPULACAO',
 'São Paulo é o município mais populoso do Brasil com mais de 11 milhões de habitantes, e a maior cidade da América do Sul.');
```

### 11.3 SQL: Usuário Admin Inicial

```sql
-- ATENÇÃO: Primeiro crie o usuário via Supabase Auth (UI ou API),
-- depois execute este SQL substituindo o auth_id correto.

-- Passo 1: Crie o usuário no painel Auth do Supabase
-- Email: admin@ibgegothic.com | Senha: Admin@2024!

-- Passo 2: Copie o UUID gerado e substitua abaixo:
UPDATE public.tb_users
SET role = 'ADMIN'
WHERE email = 'admin@ibgegothic.com';

-- Caso precise inserir manualmente:
-- INSERT INTO public.tb_users (auth_id, username, email, role)
-- VALUES ('UUID-DO-SUPABASE-AUTH', 'admin', 'admin@ibgegothic.com', 'ADMIN');
```

---

## 12. CHECKLIST DE DEPLOY E VALIDAÇÃO

### 12.1 Setup Inicial no Z.ai

```
□ 1. Criar projeto no Z.ai com template React + Vite
□ 2. Instalar dependências: npm install (baseado no package.json acima)
□ 3. Configurar tailwind.config.js e postcss.config.js
□ 4. Adicionar fontes Google no index.html
□ 5. Criar arquivo src/styles/globals.css com @tailwind directives e CSS vars
```

### 12.2 Configuração Supabase

```
□ 1. Criar projeto no Supabase (supabase.com)
□ 2. Executar o Schema SQL completo da Seção 4 no SQL Editor
□ 3. Executar os Seeds da Seção 11 (dados IBGE + questões do quiz)
□ 4. Criar usuário admin no Supabase Auth e executar UPDATE de role
□ 5. Configurar variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
□ 6. Validar políticas RLS no painel do Supabase
```

### 12.3 Validação Funcional

```
□ Autenticação
  □ Cadastro de novo usuário (role USER)
  □ Login com usuário comum → redireciona para /dashboard
  □ Login com admin → acesso ao /admin visível
  □ Logout funcional e limpeza de sessão
  □ Rota /admin bloqueada para USER (redireciona para /403)

□ Dashboard
  □ KPI Cards carregando dados do Supabase
  □ Gráficos de linha, barras e pizza renderizando
  □ Animações Framer Motion funcionando (fade-in-up)
  □ Navegação entre abas sem reload de página
  □ Layout responsivo (mobile e desktop)

□ Quiz
  □ Questões carregando aleatoriamente do banco
  □ Cronômetro regressivo funcionando
  □ Feedback visual de acerto (verde) e erro (carmesim)
  □ Pontuação calculada corretamente (acertos + bônus velocidade)
  □ Resultado salvo na tb_ranking
  □ Leaderboard exibindo top 10 com posição do usuário atual

□ Admin Panel
  □ CRUD de usuários (listar, alterar role, banir, excluir)
  □ CRUD de perguntas (criar, editar, ativar/desativar, excluir)
  □ Visualização de logs de acesso
  □ Modal de edição funcionando com AnimatePresence
  □ Busca/filtro de usuários

□ Design System
  □ Paleta gótica consistente em todas as páginas
  □ Tipografia Cinzel nos títulos, Inter no corpo
  □ Hover states e transições suaves
  □ Responsividade mobile-first
```

### 12.4 Convenções de Código

```
• Componentes: PascalCase (NomeDoComponente.jsx)
• Hooks: camelCase com prefixo "use" (useAuth, useQuiz)
• Constantes: SCREAMING_SNAKE_CASE
• Funções: camelCase (handleSubmit, fetchData)
• Classes Tailwind: utility-first, sem CSS customizado desnecessário
• Estados: useState com nomes semânticos [dado, setDado]
• Async/Await: sempre com try-catch ou verificação de error do Supabase
• Comentários: apenas onde a lógica não é auto-explicativa
```

---

## APÊNDICE: Referência Rápida de Queries Supabase

```javascript
// Buscar todos os dados de uma categoria
const { data, error } = await supabase
  .from('tb_ibge_data')
  .select('*')
  .eq('categoria', 'POPULACAO')
  .order('ano', { ascending: true });

// Buscar ranking com posição (via stored function)
const { data } = await supabase.rpc('get_ranking_with_position');

// Inserir resultado de quiz
await supabase.from('tb_ranking').insert({
  user_id, username, pontuacao, total_acertos,
  total_questoes, tempo_gasto, percentual
});

// CRUD Admin — atualizar role de usuário
await supabase.from('tb_users')
  .update({ role: 'ADMIN' })
  .eq('id', userId);

// Buscar questões aleatórias ativas
const { data } = await supabase
  .from('tb_quiz_questions')
  .select('*')
  .eq('ativo', true)
  .limit(10);
```

---

*Blueprint gerado para uso exclusivo na plataforma Z.ai.*  
*Versão do Documento: 1.0.0 — Todas as seções estão completas e prontas para implementação.*

---

**FIM DO DOCUMENTO**
