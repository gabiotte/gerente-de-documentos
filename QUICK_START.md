# Guia Rápido de Inicialização

## Passo a Passo para Começar

### 1. Instalação Rápida

Execute os seguintes comandos em sequência:

```bash
# No diretório raiz do projeto (host)
npm install

# Instalar dependências do MFE Documents
cd mfe-documents && npm install && cd ..

# Instalar dependências do MFE Approvals
cd mfe-approvals && npm install && cd ..
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá em **Settings** → **API**
4. Copie a **URL** e a **anon/public key**

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Criar Tabelas no Supabase

1. Acesse o **SQL Editor** no painel do Supabase
2. Cole e execute o seguinte SQL:

```sql
-- Tabela de documentos
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  size bigint not null,
  uploaded_at timestamptz default now(),
  uploaded_by uuid references auth.users(id),
  status text default 'pending',
  version integer default 1,
  url text
);

alter table documents enable row level security;

create policy "Users can view own documents"
  on documents for select
  to authenticated
  using (auth.uid() = uploaded_by);

create policy "Users can upload documents"
  on documents for insert
  to authenticated
  with check (auth.uid() = uploaded_by);

-- Tabela de aprovações
create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id),
  requested_by uuid references auth.users(id),
  requested_at timestamptz default now(),
  status text default 'pending',
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  comments text
);

alter table approvals enable row level security;

create policy "Users can view own approval requests"
  on approvals for select
  to authenticated
  using (auth.uid() = requested_by);

create policy "Users can create approval requests"
  on approvals for insert
  to authenticated
  with check (auth.uid() = requested_by);
```

### 5. Criar Usuário de Teste

No **SQL Editor** do Supabase, crie um usuário:

```sql
-- Criar usuário de teste
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste@exemplo.com',
  crypt('senha123', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

Ou use o painel de **Authentication** → **Users** → **Add user**.

### 6. Executar as Aplicações

Você precisa de **3 terminais** abertos:

**Terminal 1 - MFE Documents:**
```bash
cd mfe-documents
npm run dev
```

**Terminal 2 - MFE Approvals:**
```bash
cd mfe-approvals
npm run dev
```

**Terminal 3 - Host:**
```bash
npm run dev
```

### 7. Acessar o Sistema

Abra o navegador em: **http://localhost:5173**

Use as credenciais:
- **Email:** teste@exemplo.com
- **Senha:** senha123

## Verificação de Problemas Comuns

### ❌ Erro: "Failed to fetch dynamically imported module"

**Solução:** Certifique-se de que os MFEs estão rodando ANTES do host.

### ❌ Erro: "Invalid login credentials"

**Solução:** Verifique se o usuário foi criado no Supabase e se o email está confirmado.

### ❌ Erro: "supabaseUrl is required"

**Solução:** Verifique se o arquivo `.env` existe e está preenchido corretamente.

### ✅ Tudo funcionando?

Você deve ver:
- Tela de login
- Após login: Dashboard com estatísticas
- Menu lateral com "Documentos" e "Aprovações"
- Navegação funcionando entre as seções

## Explorando o Sistema

### 1. Dashboard
- Visualize estatísticas gerais
- Veja atividades recentes
- Gráficos de documentos por status

### 2. Documentos
- Clique em "Documentos" no menu
- Veja a lista de documentos mock
- Clique em "Novo Documento" para testar upload
- Use os filtros para buscar

### 3. Aprovações
- Clique em "Aprovações" no menu
- Veja aprovações pendentes
- Teste aprovar/rejeitar documentos
- Visualize estatísticas de aprovações

## Próximos Passos

Agora que o sistema está funcionando, você pode:

1. **Personalizar o design** - Edite os componentes em `src/components/`
2. **Adicionar funcionalidades** - Crie novos componentes e páginas
3. **Integrar com Supabase Storage** - Implemente upload real de arquivos
4. **Adicionar mais domínios** - Crie novos microfrontends
5. **Implementar testes** - Adicione testes unitários e de integração

## Estrutura do Código

```
📁 project/ (Host - porta 5173)
   ├── 📁 src/
   │   ├── 📁 components/layout/    → Header, Sidebar
   │   ├── 📁 pages/                → Dashboard, Login
   │   └── 📁 contexts/             → AuthContext

📁 mfe-documents/ (porta 5174)
   └── 📁 src/
       ├── 📁 components/           → DocumentCard, DocumentUpload
       └── 📁 pages/                → DocumentsPage, UploadPage

📁 mfe-approvals/ (porta 5175)
   └── 📁 src/
       ├── 📁 components/           → ApprovalCard, ApprovalList
       └── 📁 pages/                → ApprovalsPage
```

## Comandos Úteis

```bash
# Instalar todas as dependências de uma vez
npm install && cd mfe-documents && npm install && cd ../mfe-approvals && npm install && cd ..

# Limpar node_modules
rm -rf node_modules mfe-documents/node_modules mfe-approvals/node_modules

# Build para produção
npm run build && cd mfe-documents && npm run build && cd ../mfe-approvals && npm run build

# Verificar tipos TypeScript
npm run typecheck
```

## Precisa de Ajuda?

- 📖 Leia a [documentação completa](./README.md)
- 🏗️ Veja a [arquitetura detalhada](./ARCHITECTURE.md)
- 🔍 Verifique o console do navegador para erros
- 📋 Confira os logs dos terminais

---

**Pronto!** Seu sistema de microfrontends está rodando. Explore e personalize à vontade!
