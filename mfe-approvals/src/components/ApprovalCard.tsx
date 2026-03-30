import { FileText, Calendar, User, Clock } from 'lucide-react';
import { Approval } from '../types/approval';

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

export function ApprovalCard({ approval, onApprove, onReject, onView }: ApprovalCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pending: 'Aguardando',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-orange-50 rounded-lg">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{approval.documentName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{approval.requestedBy}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[approval.status]}`}>
          {statusLabels[approval.status]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(approval.requestedAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(approval.requestedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {approval.status === 'pending' ? (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(approval.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Aprovar
          </button>
          <button
            onClick={() => onReject(approval.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Rejeitar
          </button>
        </div>
      ) : (
        <button
          onClick={() => onView(approval.id)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Ver Detalhes
        </button>
      )}
    </div>
  );
}
