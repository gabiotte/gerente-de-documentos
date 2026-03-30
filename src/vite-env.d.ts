/// <reference types="vite/client" />

declare module 'mfeDocuments/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'mfeApprovals/App' {
  const App: React.ComponentType;
  export default App;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
