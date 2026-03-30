# Arquitetura do Sistema SaaS de Gestão de Documentos de RH

## 1. Visão Geral da Solução

Este sistema frontend implementa uma arquitetura de **microfrontends** usando **Module Federation** para criar uma aplicação modular, escalável e independentemente deployável. O sistema é dividido em três projetos principais:

- **Host/Shell**: Aplicação principal que orquestra os microfrontends
- **MFE Documents**: Microfrontend de Gestão de Documentos
- **MFE Approvals**: Microfrontend de Fluxo de Aprovação e Assinatura

### Benefícios da Arquitetura

- **Autonomia de equipes**: Cada domínio pode ser desenvolvido independentemente
- **Deployments independentes**: Atualizar um microfrontend sem afetar os outros
- **Escalabilidade**: Cada microfrontend pode escalar conforme necessidade
- **Tecnologia flexível**: Possibilidade de usar diferentes versões ou bibliotecas
- **Manutenibilidade**: Código organizado por domínio de negócio

---

## 2. Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                       HOST/SHELL                             │
│  - Roteamento principal                                      │
│  - Layout compartilhado (Header, Sidebar, Footer)           │
│  - Autenticação                                              │
│  - Gerenciamento de estado global                           │
└───────────┬─────────────────────────────┬───────────────────┘
            │                             │
            │ Module Federation           │ Module Federation
            │                             │
┌───────────▼──────────────┐  ┌──────────▼──────────────────┐
│   MFE DOCUMENTS          │  │   MFE APPROVALS             │
│  - Upload documentos     │  │  - Assinatura eletrônica    │
│  - Consulta documentos   │  │  - Aprovação/rejeição       │
│  - Versionamento         │  │  - Controle de status       │
│  - Armazenamento         │  │  - Workflow                 │
└──────────────────────────┘  └─────────────────────────────┘
```

### 2.1 Host/Shell

**Responsabilidades:**
- Carregar e orquestrar os microfrontends remotos
- Gerenciar autenticação e autorização
- Prover layout compartilhado (navegação, header, sidebar)
- Roteamento principal da aplicação
- Gerenciar estado global compartilhado

**Portas:** 5173 (desenvolvimento)

### 2.2 MFE Documents (Gestão de Documentos)

**Responsabilidades:**
- Gerenciar o ciclo de vida dos documentos
- Upload e download de arquivos
- Organização e categorização
- Versionamento de documentos
- Consulta e busca

**Rotas expostas:**
- `/documents` - Lista de documentos
- `/documents/upload` - Upload de documentos
- `/documents/:id` - Visualização de documento

**Portas:** 5174 (desenvolvimento)

### 2.3 MFE Approvals (Fluxo de Aprovação e Assinatura)

**Responsabilidades:**
- Controlar processos de assinatura eletrônica
- Gerenciar aprovações e rejeições
- Acompanhar status de documentos
- Workflow de aprovação

**Rotas expostas:**
- `/approvals` - Lista de aprovações pendentes
- `/approvals/:id` - Detalhes da aprovação
- `/signatures` - Gerenciar assinaturas

**Portas:** 5175 (desenvolvimento)

---

## 3. Divisão dos Microfrontends por Domínio

### Domínio 1: Gestão de Documentos (MFE Documents)

**Telas principais:**
1. **Dashboard de Documentos** - Visão geral, estatísticas
2. **Lista de Documentos** - Tabela com filtros e busca
3. **Upload de Documentos** - Formulário de upload com drag-and-drop
4. **Visualização de Documento** - Detalhes, preview, histórico

**Componentes principais:**
- `DocumentList` - Lista de documentos
- `DocumentUpload` - Componente de upload
- `DocumentCard` - Card de documento
- `DocumentViewer` - Visualizador de documentos
- `DocumentFilters` - Filtros e busca

**Entidades:**
- Document (id, name, type, size, uploadedAt, uploadedBy, status, version)
- DocumentType (id, name, description, requiredFields)
- DocumentVersion (id, documentId, version, uploadedAt, changes)

### Domínio 2: Fluxo de Aprovação (MFE Approvals)

**Telas principais:**
1. **Dashboard de Aprovações** - Pendências, estatísticas
2. **Lista de Pendências** - Documentos aguardando aprovação
3. **Detalhes da Aprovação** - Visualização e ações (aprovar/rejeitar)
4. **Histórico de Assinaturas** - Log de assinaturas realizadas

**Componentes principais:**
- `ApprovalList` - Lista de aprovações
- `ApprovalCard` - Card de aprovação
- `SignaturePanel` - Painel de assinatura
- `ApprovalTimeline` - Timeline de aprovações
- `ApprovalActions` - Botões de ação

**Entidades:**
- Approval (id, documentId, requestedBy, status, createdAt, completedAt)
- Signature (id, approvalId, signedBy, signedAt, type)
- ApprovalStatus (pending, approved, rejected, cancelled)

---

## 4. Estrutura de Pastas

```
hr-docs-system/
├── host/                           # Aplicação host/shell
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   └── shared/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── mfe-documents/                  # Microfrontend de Documentos
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   └── DocumentFilters.tsx
│   │   ├── pages/
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── UploadPage.tsx
│   │   │   └── DocumentDetailPage.tsx
│   │   ├── services/
│   │   │   └── documentService.ts
│   │   ├── types/
│   │   │   └── document.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── mfe-approvals/                  # Microfrontend de Aprovações
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ApprovalList.tsx
    │   │   ├── ApprovalCard.tsx
    │   │   ├── SignaturePanel.tsx
    │   │   ├── ApprovalTimeline.tsx
    │   │   └── ApprovalActions.tsx
    │   ├── pages/
    │   │   ├── ApprovalsPage.tsx
    │   │   ├── ApprovalDetailPage.tsx
    │   │   └── SignaturesPage.tsx
    │   ├── services/
    │   │   └── approvalService.ts
    │   ├── types/
    │   │   └── approval.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## 5. Tecnologias Utilizadas

### Core
- **React 18.3.1**: Biblioteca para construção de interfaces
- **Vite 5.4.2**: Build tool rápido e moderno
- **Tailwind CSS 3.4.1**: Framework CSS utility-first
- **TypeScript 5.5.3**: Tipagem estática

### Module Federation
- **@originjs/vite-plugin-federation**: Plugin para Module Federation no Vite

### Roteamento
- **React Router DOM v6**: Roteamento declarativo

### Gerenciamento de Estado
- **Zustand** ou **Context API**: Estado global compartilhado

### UI/UX
- **Lucide React**: Ícones modernos
- **React Dropzone**: Upload de arquivos
- **React PDF**: Visualização de PDFs

### Supabase (Backend)
- **@supabase/supabase-js**: Client para autenticação e storage
- **Storage**: Armazenamento de documentos
- **Auth**: Autenticação de usuários
- **Database**: PostgreSQL para metadados

### Justificativas

**Vite**: Build extremamente rápido, HMR instantâneo, suporte nativo a TypeScript
**Module Federation**: Permite carregamento dinâmico de módulos remotos em runtime
**Tailwind CSS**: Desenvolvimento rápido, consistência de design, otimização automática
**TypeScript**: Segurança de tipos, melhor DX, refatoração mais segura
**Supabase**: Backend completo, autenticação integrada, storage de arquivos

---

## 6. Comunicação entre Microfrontends

### Estratégias de Comunicação

1. **Event Bus (Custom Events)**
   - Para comunicação desacoplada entre MFEs
   - Exemplo: notificar quando um documento é aprovado

2. **Shared State (Context/Zustand)**
   - Estado compartilhado pelo host
   - Exemplo: informações do usuário autenticado

3. **Props Drilling**
   - Para comunicação direta entre componentes
   - Exemplo: passar dados via props para componentes remotos

4. **URL/Query Params**
   - Para compartilhar estado via URL
   - Exemplo: filtros, paginação

---

## 7. Estratégia de Autenticação

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│  Supabase Auth  │
└────┬────────────┘
     │
     ▼
┌──────────────────┐
│  AuthContext     │  (no Host)
│  - user          │
│  - session       │
│  - signIn()      │
│  - signOut()     │
└────┬─────────────┘
     │
     ├──▶ MFE Documents (recebe via props/context)
     │
     └──▶ MFE Approvals (recebe via props/context)
```

---

## 8. Boas Práticas

### 8.1 Organização por Domínio
- Cada microfrontend é independente e autocontido
- Evitar dependências circulares entre MFEs
- Compartilhar apenas o necessário via host

### 8.2 Compartilhamento de Componentes
- Componentes compartilhados ficam no host
- Expostos via Module Federation
- Mantém consistência visual

### 8.3 Versionamento
- Cada MFE tem seu próprio package.json
- Deployments independentes com versionamento semântico
- Controle de breaking changes

### 8.4 Performance
- Code splitting automático
- Lazy loading de microfrontends
- Cache de módulos remotos

### 8.5 Segurança
- Autenticação centralizada no host
- RLS (Row Level Security) no Supabase
- Validação de permissões em cada MFE
- HTTPS obrigatório em produção

### 8.6 Testing
- Testes unitários em cada MFE
- Testes de integração no host
- Testes E2E da aplicação completa

---

## 9. Fluxo de Desenvolvimento

1. Desenvolver e testar cada MFE isoladamente
2. Integrar no host via Module Federation
3. Testar integração entre MFEs
4. Deploy independente de cada MFE
5. Host aponta para versões específicas dos MFEs

---

## 10. Próximos Passos

1. Configurar Supabase (tabelas, storage, RLS)
2. Implementar autenticação completa
3. Criar APIs/services para cada domínio
4. Implementar testes automatizados
5. Configurar CI/CD para deployments
6. Adicionar monitoramento e logging
7. Implementar feature flags
8. Adicionar internacionalização (i18n)
