import api from "./api";
import { Intent, PaginatedResponse } from "./types";

export const intentsService = {
  create: async (data: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    source?: string;
  }): Promise<Intent> => {
    const response = await api.post<Intent>("/intents", data);
    return response.data;
  },

  list: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Intent>> => {
    const response = await api.get<PaginatedResponse<Intent>>("/intents/admin", { params });
    return response.data;
  },

  accept: async (id: string): Promise<{ intent: Intent; user: any }> => {
    const response = await api.post(`/intents/admin/${id}/accept`);
    return response.data;
  },
};

