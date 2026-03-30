export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Approval {
  id: string;
  documentId: string;
  documentName: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

export interface Signature {
  id: string;
  approvalId: string;
  signedBy: string;
  signedAt: string;
  type: 'electronic' | 'digital';
}
