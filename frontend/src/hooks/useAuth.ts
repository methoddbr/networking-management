import { useState, useEffect, useCallback } from "react";
import { Role } from "../services/types";

interface AuthUser {
  id: string;
  role: Role;
}

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

// Mock: extrai role e id do token no formato "role:user-id"
function parseMockToken(token: string): AuthUser | null {
  const parts = token.split(":");
  if (parts.length === 2) {
    const [role, id] = parts;
    if (["admin", "member", "guest"].includes(role)) {
      return { id, role: role as Role };
    }
  }
  return null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  // Carrega token do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        const parsedUser = parseMockToken(storedToken);
        if (parsedUser) {
          setTokenState(storedToken);
          setUser(parsedUser);
        } else {
          // Token inválido, remove
          localStorage.removeItem("auth_token");
        }
      }
    }
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", newToken);
      setTokenState(newToken);
      setUser(newUser);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      setTokenState(null);
      setUser(null);
    }
  }, []);

  const setToken = useCallback((newToken: string) => {
    const parsedUser = parseMockToken(newToken);
    if (parsedUser) {
      login(newToken, parsedUser);
    }
  }, [login]);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    setToken,
  };
}

