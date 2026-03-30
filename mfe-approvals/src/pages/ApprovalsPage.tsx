import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Approval, ApprovalStatus } from '../types/approval';
import { ApprovalList } from '../components/ApprovalList';

const mockApprovals: Approval[] = [
  {
    id: '1',
    documentId: '1',
    documentName: 'Contrato de Trabalho - João Silva',
    requestedBy: 'João Silva',
    requestedAt: '2024-03-20T10:30:00',
    status: 'pending',
  },
  {
    id: '2',
    documentId: '2',
    documentName: 'Termo de Confidencialidade - Maria Santos',
    requestedBy: 'Maria Santos',
    requestedAt: '2024-03-19T14:20:00',
    status: 'pending',
  },
  {
    id: '3',
    documentId: '3',
    documentName: 'Atestado Médico - Pedro Costa',
    requestedBy: 'Pedro Costa',
    requestedAt: '2024-03-18T09:15:00',
    status: 'approved',
    approvedBy: 'RH - José Ferreira',
    approvedAt: '2024-03-18T16:30:00',
  },
  {
    id: '4',
    documentId: '4',
    documentName: 'Declaração de Dependentes - Ana Lima',
    requestedBy: 'Ana Lima',
    requestedAt: '2024-03-17T16:45:00',
    status: 'rejected',
    approvedBy: 'RH - José Ferreira',
    approvedAt: '2024-03-17T18:20:00',
    comments: 'Documento ilegível, favor enviar nova versão',
  },
];

export function ApprovalsPage() {
  const [approvals] = useState<Approval[]>(mockApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const handleApprove = (id: string) => {
    console.log('Approving:', id);
    alert('Documento aprovado com sucesso!');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Motivo da rejeição:');
    if (reason) {
      console.log('Rejecting:', id, reason);
      alert('Documento rejeitado!');
    }
  };

  const handleView = (id: string) => {
    console.log('Viewing approval:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aprovações</h2>
          <p className="text-gray-600 mt-1">
            Gerencie aprovações de documentos
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Aprovados Hoje</p>
          <p className="text-2xl font-bold text-green-600">
            {approvals.filter((a) => a.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Rejeitados</p>
          <p className="text-2xl font-bold text-red-600">
            {approvals.filter((a) => a.status === 'rejected').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{approvals.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por documento ou funcionário..."
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

      <ApprovalList
        approvals={filteredApprovals}
        onApprove={handleApprove}
        onReject={handleReject}
        onView={handleView}
      />
    </div>
  );
}
