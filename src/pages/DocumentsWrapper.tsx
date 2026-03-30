import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

const DocumentsApp = lazy(() => import('mfeDocuments/App'));

export function DocumentsWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Carregando módulo de documentos..." />}>
      <DocumentsApp />
    </Suspense>
  );
}
