import { Approval } from '../types/approval';
import { ApprovalCard } from './ApprovalCard';

interface ApprovalListProps {
  approvals: Approval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

export function ApprovalList({ approvals, onApprove, onReject, onView }: ApprovalListProps) {
  if (approvals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma aprovação encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {approvals.map((approval) => (
        <ApprovalCard
          key={approval.id}
          approval={approval}
          onApprove={onApprove}
          onReject={onReject}
          onView={onView}
        />
      ))}
    </div>
  );
}
