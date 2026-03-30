import { Routes, Route, Navigate } from 'react-router-dom';
import { ApprovalsPage } from './pages/ApprovalsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/approvals" replace />} />
      <Route path="/approvals" element={<ApprovalsPage />} />
    </Routes>
  );
}

export default App;
