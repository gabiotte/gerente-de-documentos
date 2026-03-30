import { Routes, Route, Navigate } from 'react-router-dom';
import { DocumentsPage } from './pages/DocumentsPage';
import { UploadPage } from './pages/UploadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/documents" replace />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/documents/upload" element={<UploadPage />} />
    </Routes>
  );
}

export default App;
