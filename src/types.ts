export type ReportStatus = 'Pending' | 'Under Review' | 'Verified' | 'Resolved';

export type ReportCategory =
  | 'Illegal Dumping'
  | 'Road Damage'
  | 'Water Leakage'
  | 'Streetlight Issue'
  | 'Waste Management'
  | 'Sewage Issue'
  | 'Encroachment'
  | 'Other';

export interface TimelineEvent {
  status: ReportStatus;
  note: string;
  actor: string;
  actorRole: Role;
  timestamp: number;
}

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  location: string;
  image?: string; // data URL
  status: ReportStatus;
  citizenName: string;
  citizenContact: string;
  assignedInspector?: string;
  createdAt: number;
  updatedAt: number;
  timeline: TimelineEvent[];
}

export type Role = 'citizen' | 'inspector' | 'admin';

export interface Session {
  role: Role;
  name: string;
  identifier: string;
}
