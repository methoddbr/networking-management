import api from "./api";
import { PaginatedResponse, Referral, ReferralStatus, Thank } from "./types";

export const referralsService = {
  create: async (data: {
    toMemberId: string;
    clientName: string;
    description?: string;
    valueEstimated?: number;
  }): Promise<Referral> => {
    const response = await api.post<Referral>("/referrals", data);
    return response.data;
  },

  // Adicionar em referrals.service.ts
  list: async (params?: {
    status?: ReferralStatus;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Referral>> => {
    const response = await api.get<PaginatedResponse<Referral>>("/referrals", {
      params,
    });
    return response.data;
  },

  update: async (
    id: string,
    data: {
      status: "open" | "contacted" | "in_progress" | "won" | "lost";
      description?: string;
      valueEstimated?: number;
    }
  ): Promise<Referral> => {
    const response = await api.patch<Referral>(`/referrals/${id}`, data);
    return response.data;
  },

  thank: async (id: string, message: string): Promise<Thank> => {
    const response = await api.post<Thank>(`/referrals/${id}/thank`, {
      message,
    });
    return response.data;
  },
};
