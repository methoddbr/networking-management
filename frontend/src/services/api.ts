import axios, { AxiosInstance, AxiosError } from "axios";

// Configuração base da API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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
    if (typeof window !== "undefined") {
      // Busca token do localStorage no formato "role:user-id"
      // Exemplo: "admin:456" ou "member:123"
      const token = localStorage.getItem("auth_token");

      if (token) {
        // Adiciona Bearer antes do token
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Para desenvolvimento/teste: usa um token admin padrão
        // REMOVER EM PRODUÇÃO!
        if (process.env.NODE_ENV === "development") {
          config.headers.Authorization = "Bearer admin:dev-admin-123";
        }
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
        // Poderia redirecionar para login aqui
        console.error("Token inválido ou expirado. Faça login novamente.");
      }
    }

    if (error.response?.status === 403) {
      console.error("Acesso negado. Permissões insuficientes.");
    }

    return Promise.reject(error);
  }
);

export default api;
