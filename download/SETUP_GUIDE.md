# 🧛 IBGE Gothic Portal — Guia Completo de Setup

> Tudo pronto para copiar e colar. Basta seguir os passos na ordem.

---

## FASE 0 — Supabase (Banco de Dados + Autenticação)

### 0.1 — Criar Projeto no Supabase

1. Acesse **https://supabase.com** e crie uma conta (grátis)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `ibge-gothic-portal`
   - **Database Password**: escolha uma senha forte (anote!)
   - **Region**: escolha a mais próxima do Brasil (ex: São Paulo)
4. Clique em **"Create new project"** e aguarde ~2 min

### 0.2 — ⚠️ DESABILITAR Confirmação de E-mail (IMPORTANTE!)

1. No painel do Supabase, vá em **Authentication → Settings**
2. Desative a opção **"Enable email confirmations"** (desmarque)
3. Clique em **Save**
4. Também em **Authentication → Settings**, desative **"Enable email signups"** se quiser permitir cadastro livre (geralmente já vem ativado)

> 🔴 **SEM ESTE PASSO, os usuários não conseguirão fazer login!** O Supabase exigiria confirmação de email, mas não teria SMTP configurado.

### 0.3 — Executar o SQL Schema

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Copie e cole TODO o conteúdo do arquivo `supabase_schema.sql`
4. Clique em **"Run"** (ou Ctrl+Enter)
5. Aguarde a mensagem de sucesso

> Isso criará as 5 tabelas, índices, RLS policies, triggers e os dados iniciais (20 questões do quiz + 9 registros IBGE).

### 0.4 — Pegar as Credenciais

1. No painel do Supabase, vá em **Settings → API**
2. Copie:
   - **Project URL** → algo como `https://apbjqnfjnhrutbuodaxw.supabase.co`
   - **anon public key** → algo como `eyJhbGciOiJIUzI1NiIs...`

> ⚠️ NÃO copie a URL com `/rest/v1/` no final! Use apenas a URL base.

---

## FASE 1 — Projeto Next.js (Frontend)

### 1.1 — Criar o Projeto

```bash
npx create-next-app@latest ibge-gothic-portal --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ibge-gothic-portal
```

### 1.2 — Instalar Dependências

```bash
npm install @supabase/supabase-js @supabase/ssr recharts framer-motion lucide-react
```

### 1.3 — Instalar shadcn/ui

```bash
npx shadcn@latest init
```

Escolha as opções:
- Style: **Default**
- Base color: **Zinc**
- CSS variables: **Yes**

Depois instale os componentes necessários:

```bash
npx shadcn@latest add card tabs badge button select progress separator input label textarea table dialog dropdown-menu avatar toast
```

### 1.4 — Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI
```

> Substitua pelos valores que você copiou na FASE 0.4.

---

## FASE 2 — Copiar os Arquivos do Projeto

Agora copie todos os arquivos fonte para dentro de `src/`:

### Estrutura de Arquivos

```
src/
├── app/
│   ├── globals.css              ← Tokens góticos + animações
│   ├── layout.tsx               ← Layout com Cinzel font + AuthProvider
│   ├── page.tsx                 ← Dashboard principal (4 tabs)
│   ├── login/page.tsx           ← Página de login
│   ├── register/page.tsx        ← Página de cadastro
│   ├── forbidden/page.tsx       ← Página 403
│   ├── quiz/
│   │   ├── page.tsx             ← Lobby do quiz
│   │   ├── play/page.tsx        ← Game play
│   │   └── result/page.tsx      ← Resultado + ranking
│   └── admin/
│       ├── layout.tsx           ← Layout admin com sidebar
│       ├── page.tsx             ← Dashboard admin
│       ├── users/page.tsx       ← CRUD usuários
│       ├── ibge/page.tsx        ← CRUD dados IBGE
│       ├── questions/page.tsx   ← CRUD questões
│       └── logs/page.tsx        ← Logs de acesso
├── components/ui/               ← Componentes shadcn/ui (gerados)
├── contexts/
│   └── AuthContext.tsx           ← Contexto de autenticação
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── supabase.ts              ← Cliente Supabase
│   ├── ibge-data.ts             ← Dados estáticos IBGE
│   ├── utils.ts                 ← Utilitários shadcn
│   └── db.ts                    ← (não usado, pode ignorar)
└── middleware.ts                 ← Proteção de rotas
```

### Arquivos Críticos (copiar conteúdo exato)

Cada arquivo está disponível no projeto. Copie o conteúdo exato de cada um.

---

## FASE 3 — Como Virar ADMIN 🧛

Depois de se registrar no site, você precisa se promover a admin:

### Opção A — Pelo SQL Editor do Supabase

1. Vá em **Supabase → SQL Editor**
2. Execute:

```sql
UPDATE public.tb_users
SET role = 'ADMIN'
WHERE email = 'SEU_EMAIL_AQUI';
```

### Opção B — Pelo Table Editor do Supabase

1. Vá em **Supabase → Table Editor**
2. Clique na tabela `tb_users`
3. Encontre seu usuário
4. Clique no ícone de editar (lápis)
5. Mude o campo `role` de `USER` para `ADMIN`
6. Clique em **Save**

> ⚠️ A role deve ser **exatamente** `ADMIN` (maiúsculo), não `admin` nem `Admin`.

---

## FASE 4 — Deploy no Vercel (Hospedagem)

O Supabase é apenas o **banco de dados backend**. O site Next.js precisa ser hospedado no **Vercel** (grátis).

### 4.1 — Subir para o GitHub

```bash
git init
git add .
git commit -m "IBGE Gothic Portal - initial commit"
git remote add origin https://github.com/SEU_USERNAME/ibge-gothic-portal.git
git push -u origin main
```

### 4.2 — Deploy no Vercel

1. Acesse **https://vercel.com** e crie uma conta (grátis)
2. Clique em **"Add New Project"**
3. Selecione o repositório do GitHub
4. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua anon key do Supabase
5. Clique em **"Deploy"**
6. Aguarde ~2 min e acesse a URL gerada! 🎉

---

## Resumo Rápido

| Etapa | Onde | O que fazer |
|-------|------|-------------|
| Criar banco | supabase.com | Novo projeto |
| **Desabilitar email confirm** | Authentication → Settings | ⚠️ OBRIGATÓRIO! |
| Rodar SQL | SQL Editor | Colar `supabase_schema.sql` |
| Copiar credenciais | Settings → API | URL + anon key |
| Criar site | Terminal | `npx create-next-app` |
| Instalar deps | Terminal | npm install tudo |
| Configurar .env.local | Editor | Colar credenciais |
| Copiar arquivos | Editor | Todos os .tsx/.ts/.css |
| Virar admin | SQL Editor | `UPDATE tb_users SET role = 'ADMIN'` |
| Deploy | vercel.com | Conectar GitHub + env vars |

---

## Fluxo do Usuário

1. **Usuário acessa o site** → é redirecionado para /login (middleware protege)
2. **Faz cadastro** em /register → conta criada no Supabase Auth + tb_users
3. **Faz login** em /login → autenticação Supabase Auth
4. **Acessa Dashboard** em / → vê os dados do Censo 2022 com gráficos
5. **Joga Quiz** em /quiz → 10 questões com timer + ranking
6. **Admin** em /admin → gerencia usuários, dados, questões e logs (só ADMIN)

---

## Troubleshooting

### "Erro ao carregar questões" no Quiz
- Verifique se rodou o `supabase_schema.sql` completo
- Confira se as questões foram inseridas: vá em Table Editor → tb_quiz_questions

### "Credenciais inválidas" no Login
- Verifique se desabilitou **"Enable email confirmations"** no Supabase
- Tente se cadastrar novamente

### "Acesso Restrito" (403) no Admin
- Você precisa ser ADMIN. Execute o SQL da FASE 3
- Confira se o `role` está exatamente como `ADMIN` (maiúsculo)

### Erro de CORS ou "Invalid API key"
- Verifique se a URL no `.env.local` está SEM `/rest/v1/` no final
- Confira se a anon key está correta (começa com `eyJ...`)

### Build falha no Vercel
- Verifique se adicionou as env vars no Vercel
- Confira se todas as dependências estão no `package.json`
