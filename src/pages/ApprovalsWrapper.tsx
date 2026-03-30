import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

const ApprovalsApp = lazy(() => import('mfeApprovals/App'));

export function ApprovalsWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Carregando módulo de aprovações..." />}>
      <ApprovalsApp />
    </Suspense>
  );
}
