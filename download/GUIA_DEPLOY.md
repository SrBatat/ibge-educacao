# 🏛️ PORTAL IBGE GOTHIC — GUIA DE DEPLOY

## ✅ O que já está pronto (código)

| Arquivo | Função | Status |
|---------|--------|--------|
| `.env.local` | Credenciais Supabase | ✅ Configurado |
| `src/lib/supabase.ts` | Client Supabase | ✅ Criado |
| `src/contexts/AuthContext.tsx` | Autenticação (login, cadastro, logout) | ✅ Criado |
| `src/middleware.ts` | Proteção de rotas + admin check | ✅ Criado |
| `src/app/login/page.tsx` | Tela de login gótica | ✅ Criado |
| `src/app/register/page.tsx` | Tela de cadastro | ✅ Criado |
| `src/app/page.tsx` | Dashboard com auth no header | ✅ Atualizado |
| `src/app/quiz/page.tsx` | Lobby do quiz | ✅ Criado |
| `src/app/quiz/play/page.tsx` | Quiz em andamento | ✅ Criado |
| `src/app/quiz/result/page.tsx` | Resultado + leaderboard | ✅ Criado |
| `src/app/admin/layout.tsx` | Sidebar admin | ✅ Criado |
| `src/app/admin/page.tsx` | Dashboard admin | ✅ Criado |
| `src/app/admin/users/page.tsx` | CRUD usuários | ✅ Criado |
| `src/app/admin/ibge/page.tsx` | Gerenciar dados IBGE | ✅ Criado |
| `src/app/admin/questions/page.tsx` | Gerenciar perguntas quiz | ✅ Criado |
| `src/app/admin/logs/page.tsx` | Visualizar logs | ✅ Criado |
| `src/app/forbidden/page.tsx` | Página 403 | ✅ Criado |

---

## 🚨 O QUE VOCÊ PRECISA FAZER (3 passos)

### PASSO 1 — Desativar confirmação de e-mail no Supabase

1. Acesse [supabase.com](https://supabase.com) e entre no seu projeto
2. Vá em **Authentication → Providers → Email**
3. Desative a opção **"Confirm email"** (ou "Enable email confirmations")
4. Clique em **Save**

> ⚠️ SEM esse passo, os usuários cadastrados não conseguem fazer login!

---

### PASSO 2 — Executar o SQL no Supabase

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie TODO o conteúdo do arquivo `supabase_schema.sql` (está em `/download/supabase_schema.sql`)
4. Cole no editor e clique em **"Run"**
5. Aguarde a mensagem de sucesso ✅

> Isso cria: 5 tabelas, índices, triggers, RLS policies, e 20 perguntas de quiz + dados IBGE

---

### PASSO 3 — Criar o usuário Admin

Ainda no **SQL Editor**, execute:

```sql
-- Primeiro, cadastre-se no site normalmente (qualquer email/senha)
-- Depois, rode este SQL para promover seu usuário a ADMIN:
-- Substitua 'seu_email@aqui.com' pelo email que você usou no cadastro

UPDATE public.tb_users
SET role = 'ADMIN'
WHERE email = 'seu_email@aqui.com';
```

**Fluxo alternativo (mais simples):**
1. Acesse o site e clique em "Cadastre-se"
2. Crie uma conta com seu email
3. Volte ao Supabase → SQL Editor
4. Rode o UPDATE acima com seu email
5. Pronto! Agora você é ADMIN ✅

---

## 🎯 Rotas do Portal

| URL | Descrição | Requer Login? | Requer Admin? |
|-----|-----------|:---:|:---:|
| `/` | Dashboard principal | ✅ | ❌ |
| `/login` | Tela de login | ❌ | ❌ |
| `/register` | Tela de cadastro | ❌ | ❌ |
| `/quiz` | Lobby do quiz | ✅ | ❌ |
| `/quiz/play` | Quiz em andamento | ✅ | ❌ |
| `/quiz/result` | Resultado do quiz | ✅ | ❌ |
| `/admin` | Dashboard admin | ✅ | ✅ |
| `/admin/users` | CRUD de usuários | ✅ | ✅ |
| `/admin/ibge` | Dados IBGE | ✅ | ✅ |
| `/admin/questions` | Perguntas do quiz | ✅ | ✅ |
| `/admin/logs` | Logs de acesso | ✅ | ✅ |
| `/forbidden` | Acesso negado (403) | ❌ | ❌ |

---

## 🔧 Resumo das Credenciais

```
Supabase URL:  https://apbjqnfjnhrutbuodaxw.supabase.co
Supabase Key:  sb_publishable_AZO4erS3ebBfVz_ka1pbSQ_09izB1uK
```

---

## 📋 Checklist Final

- [ ] Desativar "Confirm email" no Supabase Auth
- [ ] Rodar o SQL (supabase_schema.sql) no SQL Editor
- [ ] Criar conta no site
- [ ] Promover seu usuário a ADMIN via SQL
- [ ] Testar login → dashboard → quiz → admin
