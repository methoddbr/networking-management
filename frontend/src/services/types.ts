// Tipos compartilhados para a API

export type Role = "admin" | "member" | "guest";

export type UserStatus = "PENDING" | "ACTIVE" | "REJECTED" | "INACTIVE";
export type IntentStatus = "NEW" | "REVIEWED" | "ACCEPTED" | "REJECTED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type ReferralStatus = "OPEN" | "CONTACTED" | "IN_PROGRESS" | "WON" | "LOST";

// User/Member
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  position?: string;
  role: Role;
  status: UserStatus;
  joinedAt?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

// Intent
export interface Intent {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  status: IntentStatus;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Meeting
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Attendance
export interface Attendance {
  id: string;
  meetingId: string;
  userId: string;
  status: AttendanceStatus;
  checkedAt: string;
}

// Referral
export interface Referral {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  clientName: string;
  description?: string;
  status: ReferralStatus;
  valueEstimated?: number;
  closedAt?: string;
  thanksPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Thank
export interface Thank {
  id: string;
  referralId: string;
  fromMemberId: string;
  message: string;
  createdAt: string;
}

// Response types
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    total: number;
    limit: number;
  };
}

