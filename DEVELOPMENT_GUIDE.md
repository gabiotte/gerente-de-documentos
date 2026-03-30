# Guia de Desenvolvimento

Este guia explica como estender e personalizar o sistema de microfrontends.

## Adicionando Novas Funcionalidades

### 1. Adicionando uma Nova Página no Host

**Exemplo: Criar página de Configurações**

```typescript
// src/pages/Settings.tsx
export function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p>Configurações do sistema</p>
      </div>
    </div>
  );
}
```

Adicione a rota no `App.tsx`:

```typescript
import { Settings } from './pages/Settings';

// Dentro de <Routes>
<Route
  path="/settings"
  element={
    <PrivateRoute>
      <Settings />
    </PrivateRoute>
  }
/>
```

Atualize o `Sidebar.tsx` para incluir o link:

```typescript
const menuItems = [
  // ... existentes
  {
    path: '/settings',
    label: 'Configurações',
    icon: Settings,
  },
];
```

### 2. Criando um Novo Microfrontend

**Exemplo: MFE Reports (Relatórios)**

#### Passo 1: Criar estrutura

```bash
mkdir -p mfe-reports/src/{components,pages,types}
cd mfe-reports
```

#### Passo 2: Criar package.json

```json
{
  "name": "mfe-reports",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5176",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.5",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

#### Passo 3: Configurar vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeReports',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: {
    port: 5176,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
```

#### Passo 4: Criar App.tsx

```typescript
import { Routes, Route } from 'react-router-dom';

function ReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios</h2>
      <div className="bg-white rounded-lg p-6">
        <p>Lista de relatórios</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}

export default App;
```

#### Passo 5: Integrar no Host

No `vite.config.ts` do host, adicione o remote:

```typescript
federation({
  name: 'host',
  remotes: {
    mfeDocuments: 'http://localhost:5174/assets/remoteEntry.js',
    mfeApprovals: 'http://localhost:5175/assets/remoteEntry.js',
    mfeReports: 'http://localhost:5176/assets/remoteEntry.js', // NOVO
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

Declare o módulo em `src/vite-env.d.ts`:

```typescript
declare module 'mfeReports/App' {
  const App: React.ComponentType;
  export default App;
}
```

Crie o wrapper em `src/pages/ReportsWrapper.tsx`:

```typescript
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

const ReportsApp = lazy(() => import('mfeReports/App'));

export function ReportsWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <ReportsApp />
    </Suspense>
  );
}
```

Adicione a rota no `App.tsx`:

```typescript
<Route
  path="/reports/*"
  element={
    <PrivateRoute>
      <ReportsWrapper />
    </PrivateRoute>
  }
/>
```

### 3. Adicionando Componente Compartilhado

**Exemplo: Modal reutilizável**

Crie em `src/components/shared/Modal.tsx`:

```typescript
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

### 4. Comunicação Entre Microfrontends

#### Opção A: Event Bus (Recomendado)

Crie um event bus simples:

```typescript
// src/utils/eventBus.ts
type EventCallback = (data: any) => void;

class EventBus {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();
```

Uso no MFE Documents:

```typescript
import { eventBus } from '../utils/eventBus';

// Emitir evento quando documento for aprovado
eventBus.emit('document:approved', { documentId: '123' });
```

Uso no MFE Approvals:

```typescript
import { eventBus } from '../utils/eventBus';

// Escutar evento
useEffect(() => {
  const handler = (data: any) => {
    console.log('Documento aprovado:', data);
    // Atualizar lista
  };

  eventBus.on('document:approved', handler);

  return () => eventBus.off('document:approved', handler);
}, []);
```

#### Opção B: Estado Compartilhado via Context

```typescript
// src/contexts/SharedStateContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface SharedState {
  notifications: number;
  setNotifications: (count: number) => void;
}

const SharedStateContext = createContext<SharedState | undefined>(undefined);

export function SharedStateProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(0);

  return (
    <SharedStateContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </SharedStateContext.Provider>
  );
}

export function useSharedState() {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within SharedStateProvider');
  }
  return context;
}
```

### 5. Integrando com Supabase

#### Upload de Arquivo

```typescript
import { supabase } from '../contexts/AuthContext';

async function uploadDocument(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData } = supabase
    .storage
    .from('documents')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('documents')
    .insert({
      name: file.name,
      type: file.type,
      size: file.size,
      url: urlData.publicUrl,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
```

#### Buscar Dados

```typescript
async function fetchDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) throw error;

  return data;
}
```

#### Tempo Real (Realtime)

```typescript
useEffect(() => {
  const channel = supabase
    .channel('documents')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'documents',
      },
      (payload) => {
        console.log('Change received!', payload);
        // Atualizar lista
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## Padrões de Desenvolvimento

### 1. Estrutura de Componentes

```typescript
// Componente com todas as boas práticas
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onAction?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? 'Carregando...' : 'Ação'}
      </button>
    </div>
  );
}
```

### 2. Custom Hooks

```typescript
// hooks/useDocuments.ts
import { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*');

        if (error) throw error;

        setDocuments(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  return { documents, loading, error };
}
```

Uso:

```typescript
function DocumentsPage() {
  const { documents, loading, error } = useDocuments();

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro: {error.message}</div>;

  return <DocumentList documents={documents} />;
}
```

### 3. Tratamento de Erros

```typescript
// utils/errorHandler.ts
export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    alert(`Erro: ${error.message}`);
  } else {
    console.error('Unknown error:', error);
    alert('Ocorreu um erro desconhecido');
  }
}

// Uso
try {
  await uploadDocument(file);
} catch (error) {
  handleError(error);
}
```

## Deploy em Produção

### 1. Variáveis de Ambiente para Produção

Crie `.env.production`:

```env
VITE_SUPABASE_URL=https://seu-projeto-producao.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-producao
```

### 2. Build

```bash
# Host
npm run build

# MFE Documents
cd mfe-documents && npm run build && cd ..

# MFE Approvals
cd mfe-approvals && npm run build && cd ..
```

### 3. Deploy Separado

Exemplo com Vercel:

```bash
# Deploy MFE Documents
cd mfe-documents
vercel --prod
# URL: https://documents.seuapp.com

# Deploy MFE Approvals
cd mfe-approvals
vercel --prod
# URL: https://approvals.seuapp.com

# Atualizar vite.config.ts do Host com URLs de produção
# Depois deploy do Host
vercel --prod
# URL: https://app.seuapp.com
```

## Troubleshooting

### Problema: Hot Reload não funciona

**Solução:** Reinicie o servidor de desenvolvimento.

### Problema: Tipos do TypeScript não encontrados

**Solução:** Adicione as declarações em `vite-env.d.ts`.

### Problema: Estilo não aplicado

**Solução:** Verifique se o Tailwind está configurado corretamente e se o arquivo CSS está sendo importado.

## Recursos Adicionais

- [Documentação do Module Federation](https://module-federation.github.io/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do React Router](https://reactrouter.com/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
