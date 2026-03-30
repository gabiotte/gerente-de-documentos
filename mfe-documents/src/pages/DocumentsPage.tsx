import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Document } from '../types/document';
import { DocumentList } from '../components/DocumentList';

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrato de Trabalho.pdf',
    type: 'Contrato',
    size: 245000,
    uploadedAt: '2024-03-20T10:30:00',
    uploadedBy: 'João Silva',
    status: 'approved',
    version: 1,
  },
  {
    id: '2',
    name: 'Comprovante de Residência.pdf',
    type: 'Comprovante',
    size: 180000,
    uploadedAt: '2024-03-19T14:20:00',
    uploadedBy: 'Maria Santos',
    status: 'pending',
    version: 1,
  },
  {
    id: '3',
    name: 'RG - Frente e Verso.pdf',
    type: 'Documento Pessoal',
    size: 520000,
    uploadedAt: '2024-03-18T09:15:00',
    uploadedBy: 'Pedro Costa',
    status: 'approved',
    version: 2,
  },
  {
    id: '4',
    name: 'Certidão de Nascimento.pdf',
    type: 'Documento Pessoal',
    size: 310000,
    uploadedAt: '2024-03-17T16:45:00',
    uploadedBy: 'Ana Lima',
    status: 'rejected',
    version: 1,
  },
];

export function DocumentsPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (id: string) => {
    console.log('Viewing document:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Downloading document:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentos</h2>
          <p className="text-gray-600 mt-1">Gerencie seus documentos de RH</p>
        </div>
        <button
          onClick={() => navigate('/documents/upload')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Documento
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      <DocumentList
        documents={filteredDocuments}
        onView={handleView}
        onDownload={handleDownload}
      />
    </div>
  );
}
