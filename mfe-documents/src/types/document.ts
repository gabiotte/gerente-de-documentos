export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
  url?: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  acceptedFormats: string[];
}
