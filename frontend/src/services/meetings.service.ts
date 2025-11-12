import api from "./api";
import { Meeting, Attendance, PaginatedResponse } from "./types";

export const meetingsService = {
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Meeting>> => {
    const response = await api.get<PaginatedResponse<Meeting>>("/meetings", { params });
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    date: string;
    location?: string;
  }): Promise<Meeting> => {
    const response = await api.post<Meeting>("/meetings", data);
    return response.data;
  },

  checkin: async (meetingId: string, status?: "present" | "absent" | "late"): Promise<Attendance> => {
    const response = await api.post<Attendance>(`/meetings/${meetingId}/checkin`, { status });
    return response.data;
  },

  getAttendance: async (meetingId: string): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>(`/meetings/${meetingId}/attendance`);
    return response.data;
  },
};

