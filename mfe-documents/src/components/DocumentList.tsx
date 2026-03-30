import { Document } from '../types/document';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function DocumentList({ documents, onView, onDownload }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum documento encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onView={onView}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
