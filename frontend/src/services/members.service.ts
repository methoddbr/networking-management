import api from "./api";
import { User, PaginatedResponse } from "./types";

export const membersService = {
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>("/members", { params });
    return response.data;
  },

  create: async (data: {
    email: string;
    name: string;
    phone?: string;
    company?: string;
    position?: string;
  }): Promise<User> => {
    const response = await api.post<User>("/members", data);
    return response.data;
  },
};

