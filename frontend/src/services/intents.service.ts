import api from "./api";
import { Intent, PaginatedResponse } from "./types";

export const intentsService = {
  // Criar nova intenção (público)
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

  // Listar intenções (admin) - CORRIGIDO para seguir o OpenAPI
  list: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Intent>> => {
    const response = await api.get<PaginatedResponse<Intent>>(
      "/intents/admin",
      { params }
    );
    return response.data;
  },

  // Aceitar intenção (admin) - CORRIGIDO para seguir o OpenAPI
  accept: async (id: string): Promise<{ intent: Intent; user: any }> => {
    const response = await api.post(`/intents/admin/${id}/accept`);
    return response.data;
  },

  // Rejeitar intenção (admin) - Endpoint não existe no OpenAPI ainda
  // Mas vou deixar preparado caso adicione no backend
  reject: async (id: string): Promise<Intent> => {
    const response = await api.post<Intent>(`/intents/admin/${id}/reject`);
    return response.data;
  },
};
