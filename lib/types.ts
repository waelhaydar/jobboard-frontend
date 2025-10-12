export interface Admin {
  id: number;
  // Add other relevant fields for Admin
}

export interface Candidate {
  id: number;
  // Add other relevant fields for Candidate
}

export interface Employer {
  id: number;
  approved: boolean; // Add approved property as required to fix TS error
  // Add other relevant fields for Employer
}

export type AuthResult = {
  type: string;
  user: Candidate | null;
  admin: Admin | null;
  employer: Employer | null;
  email?: string;
}

export interface Job {
  id: string;
  title: string;
  // Add other relevant fields for Job if needed
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  employerId?: number;
  candidateId?: number;
  admin: boolean;
  jobId?: string;
}

export interface NotificationWithJob extends Notification {
  Job?: Job | null;
}

export type NotificationWithJobPayload = Notification & { Job?: Job | null };
