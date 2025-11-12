import axios, { AxiosInstance, AxiosError } from "axios";

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Cria instância do axios com configurações padrão
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Busca token do localStorage (ou de onde estiver armazenado)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Tratamento de erros comum
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Redirecionar para login se necessário
      }
    }
    return Promise.reject(error);
  }
);

export default api;

