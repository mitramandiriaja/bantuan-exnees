export type UserRole = "admin" | "user";

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  email: string;
  activity: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface EducationMaterial {
  id: string;
  title: string;
  category: "Dasar" | "Teknis" | "Psikologi" | "Manajemen Risiko";
  level: "Pemula" | "Menengah";
  readTime: string;
  content: string;
  summary: string;
}
