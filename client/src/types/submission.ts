export interface Submission {
  id: number | string;
  title: string;
  category?: string;
  type?: string; // For backwards compatibility
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  reviewer?: string;
  files?: string[];
  priority?: string;
  description?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

export interface OfficerSubmission {
  id: number;
  title: string;
  type: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer: string;
  approvedDate?: string;
  rejectionReason?: string;
  rejectedDate?: string;
  category?: string;
  files?: string[];
  priority?: string;
  description?: string;
}

export interface ActivityLogItem {
  id: number;
  title: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

export default Submission;
