import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DocumentUpload } from '../components/DocumentUpload';

export function UploadPage() {
  const navigate = useNavigate();

  const handleUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    alert(`${files.length} arquivo(s) enviado(s) com sucesso!`);
    navigate('/documents');
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/documents')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Enviar Documentos</h2>
        <p className="text-gray-600 mt-1">Faça upload dos seus documentos de RH</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DocumentUpload onUpload={handleUpload} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Documentos aceitos</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• RG, CPF, CNH (frente e verso)</li>
          <li>• Comprovante de residência (até 3 meses)</li>
          <li>• Certidão de nascimento ou casamento</li>
          <li>• Carteira de trabalho (páginas principais)</li>
          <li>• Comprovante de escolaridade</li>
          <li>• Foto 3x4 recente</li>
        </ul>
      </div>
    </div>
  );
}
