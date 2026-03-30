import { FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { Document } from '../types/document';

interface DocumentCardProps {
  document: Document;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function DocumentCard({ document, onView, onDownload }: DocumentCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{document.name}</h3>
            <p className="text-sm text-gray-600">{document.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
          {statusLabels[document.status]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(document.uploadedAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{document.uploadedBy}</span>
        </div>
        <div className="text-gray-500">
          {formatFileSize(document.size)}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(document.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Visualizar
        </button>
        <button
          onClick={() => onDownload(document.id)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
