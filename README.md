# Sistema SaaS de Gestão de Documentos de RH

Sistema modular de gestão de documentos de RH construído com arquitetura de microfrontends usando React, Vite, Tailwind CSS e Module Federation.

## Arquitetura

Este sistema é composto por três aplicações independentes:

### 1. Host/Shell (Porta 5173)
Aplicação principal que orquestra os microfrontends e fornece:
- Layout compartilhado (Header, Sidebar)
- Autenticação e gerenciamento de sessão
- Roteamento principal
- Dashboard

### 2. MFE Documents (Porta 5174)
Microfrontend responsável pela gestão de documentos:
- Lista de documentos
- Upload de documentos
- Visualização de documentos
- Filtros e busca

### 3. MFE Approvals (Porta 5175)
Microfrontend responsável pelo fluxo de aprovação:
- Lista de aprovações pendentes
- Aprovação/rejeição de documentos
- Timeline de aprovações
- Estatísticas

## Tecnologias Utilizadas

- **React 18.3** - Biblioteca UI
- **Vite 5.4** - Build tool
- **Tailwind CSS 3.4** - Estilização
- **TypeScript 5.5** - Tipagem estática
- **Module Federation** - Arquitetura de microfrontends
- **React Router DOM** - Roteamento
- **Supabase** - Backend (Auth, Database, Storage)
- **Lucide React** - Ícones

## Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)

## Instalação

### 1. Clone o repositório e instale as dependências do Host

```bash
cd project
npm install
```

### 2. Instale as dependências dos microfrontends

```bash
cd mfe-documents
npm install
cd ..

cd mfe-approvals
npm install
cd ..
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto host:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Configure o Supabase

Acesse o painel do Supabase e execute o seguinte SQL:

```sql
-- Habilitar autenticação por email/senha
-- (já vem habilitado por padrão)

-- Criar tabela de documentos
create table documents (
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

-- Criar tabela de aprovações
create table approvals (
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

## Execução Local

Para executar o sistema localmente, você precisa iniciar as três aplicações em terminais separados:

### Terminal 1 - Host (Shell)
```bash
cd project
npm run dev
```
Acesse: http://localhost:5173

### Terminal 2 - MFE Documents
```bash
cd project/mfe-documents
npm run dev
```
Roda em: http://localhost:5174

### Terminal 3 - MFE Approvals
```bash
cd project/mfe-approvals
npm run dev
```
Roda em: http://localhost:5175

## Ordem de Inicialização

**IMPORTANTE:** Sempre inicie os microfrontends (Documents e Approvals) ANTES do host, pois o host tenta carregar os módulos remotos na inicialização.

Ordem recomendada:
1. MFE Documents (5174)
2. MFE Approvals (5175)
3. Host (5173)

## Estrutura de Diretórios

```
project/
├── src/                        # Host/Shell
│   ├── components/
│   │   ├── layout/            # Header, Sidebar, MainLayout
│   │   └── shared/            # Button, Card, LoadingSpinner
│   ├── contexts/              # AuthContext
│   ├── pages/                 # Dashboard, Login, Wrappers
│   ├── App.tsx
│   └── main.tsx
├── mfe-documents/             # Microfrontend de Documentos
│   ├── src/
│   │   ├── components/        # DocumentCard, DocumentList, DocumentUpload
│   │   ├── pages/             # DocumentsPage, UploadPage
│   │   ├── types/             # document.ts
│   │   └── App.tsx
│   └── vite.config.ts         # Configuração do Module Federation
├── mfe-approvals/             # Microfrontend de Aprovações
│   ├── src/
│   │   ├── components/        # ApprovalCard, ApprovalList, ApprovalTimeline
│   │   ├── pages/             # ApprovalsPage
│   │   ├── types/             # approval.ts
│   │   └── App.tsx
│   └── vite.config.ts         # Configuração do Module Federation
└── ARCHITECTURE.md            # Documentação completa da arquitetura
```

## Funcionalidades Implementadas

### Host/Shell
- ✅ Autenticação com Supabase
- ✅ Layout responsivo com sidebar e header
- ✅ Proteção de rotas
- ✅ Dashboard com estatísticas
- ✅ Navegação entre microfrontends

### MFE Documents
- ✅ Lista de documentos com filtros
- ✅ Upload de documentos (drag-and-drop)
- ✅ Visualização de detalhes
- ✅ Indicadores de status

### MFE Approvals
- ✅ Lista de aprovações pendentes
- ✅ Aprovação/rejeição de documentos
- ✅ Estatísticas de aprovações
- ✅ Timeline de eventos

## Como Funciona o Module Federation

O Module Federation permite que cada microfrontend seja desenvolvido e deployado independentemente. O host carrega os microfrontends dinamicamente em runtime:

```typescript
// No vite.config.ts do Host
federation({
  name: 'host',
  remotes: {
    mfeDocuments: 'http://localhost:5174/assets/remoteEntry.js',
    mfeApprovals: 'http://localhost:5175/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})

// No vite.config.ts dos MFEs
federation({
  name: 'mfeDocuments',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

## Build para Produção

Para fazer build de produção:

```bash
# Host
cd project
npm run build

# MFE Documents
cd mfe-documents
npm run build

# MFE Approvals
cd mfe-approvals
npm run build
```

Os arquivos compilados estarão em `dist/` de cada projeto.

## Deploy

Cada aplicação pode ser deployada independentemente em qualquer servidor estático (Vercel, Netlify, etc.):

1. Deploy o MFE Documents para `https://documents.seudominio.com`
2. Deploy o MFE Approvals para `https://approvals.seudominio.com`
3. Atualize o `vite.config.ts` do Host com as URLs de produção
4. Deploy o Host para `https://app.seudominio.com`

## Criando um Novo Usuário

Acesse `/login` e use o painel do Supabase para criar usuários:

```sql
-- No SQL Editor do Supabase
insert into auth.users (email, encrypted_password, email_confirmed_at)
values ('usuario@exemplo.com', crypt('senha123', gen_salt('bf')), now());
```

Ou use a API de signup (descomente a funcionalidade de registro no Login.tsx).

## Troubleshooting

### Erro: "Failed to fetch dynamically imported module"

**Causa:** Os microfrontends não estão rodando ou foram iniciados depois do host.

**Solução:** Reinicie as aplicações na ordem correta (MFEs primeiro, host depois).

### Erro: "Invalid Supabase credentials"

**Causa:** Variáveis de ambiente não configuradas corretamente.

**Solução:** Verifique se o arquivo `.env` existe e contém as credenciais corretas do Supabase.

### Microfrontend não carrega

**Causa:** Portas incorretas ou conflito de portas.

**Solução:** Verifique se as portas 5173, 5174 e 5175 estão livres e se as URLs no `vite.config.ts` estão corretas.

## Próximos Passos

- [ ] Implementar integração real com Supabase Storage
- [ ] Adicionar assinatura eletrônica real
- [ ] Implementar notificações em tempo real
- [ ] Adicionar testes automatizados
- [ ] Implementar CI/CD
- [ ] Adicionar internacionalização (i18n)
- [ ] Implementar upload de múltiplos arquivos simultâneos
- [ ] Adicionar visualizador de PDF inline
- [ ] Implementar histórico de versões de documentos

## Boas Práticas

### Desenvolvimento de Microfrontends

1. **Autonomia**: Cada MFE deve ser independente e executável isoladamente
2. **Comunicação**: Use eventos ou estado compartilhado para comunicação entre MFEs
3. **Versionamento**: Mantenha compatibilidade entre versões dos MFEs
4. **Performance**: Compartilhe dependências comuns (React, React Router) via Module Federation
5. **Testing**: Teste cada MFE isoladamente e a integração no host

### Segurança

1. **RLS (Row Level Security)**: Sempre habilite RLS nas tabelas do Supabase
2. **Autenticação**: Centralize a autenticação no host
3. **Validação**: Valide dados tanto no frontend quanto no backend
4. **HTTPS**: Use HTTPS em produção
5. **Secrets**: Nunca commite credenciais no código

### Performance

1. **Code Splitting**: Module Federation já faz isso automaticamente
2. **Lazy Loading**: Use React.lazy() para carregar MFEs sob demanda
3. **Caching**: Configure cache apropriado para módulos remotos
4. **Bundle Size**: Compartilhe bibliotecas comuns entre MFEs

## Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação completa](./ARCHITECTURE.md)
2. Verifique os logs do console do navegador
3. Verifique os logs do terminal de cada aplicação

## Licença

Este projeto é um exemplo educacional e pode ser usado livremente.
