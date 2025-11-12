"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/common";
import {
  setAuthToken,
  removeAuthToken,
  decodeAuthToken,
  UserRole,
} from "@/src/utils/authUtils";

/**
 * Componente de autenticação para desenvolvimento
 * Remove isso em produção e implemente login real!
 */
export function DevAuthButton() {
  const [currentToken, setCurrentToken] = useState<{
    role: UserRole;
    userId: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = decodeAuthToken();
    setCurrentToken(token);
  }, []);

  const handleLogin = (role: UserRole, userId: string) => {
    setAuthToken(role, userId);
    setCurrentToken({ role, userId });
    setIsOpen(false);
    window.location.reload(); // Recarrega para aplicar o token
  };

  const handleLogout = () => {
    removeAuthToken();
    setCurrentToken(null);
    window.location.reload();
  };

  // Só mostra em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {currentToken ? (
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                🔓 Autenticado como:
              </div>
              <div className="text-blue-600">
                {currentToken.role}:{currentToken.userId}
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className="shadow-lg"
          >
            🔒 Dev Login
          </Button>

          {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-4 border w-64">
              <h3 className="font-semibold text-gray-900 mb-3">
                Login de Desenvolvimento
              </h3>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLogin("admin", "dev-admin-123")}
                  className="w-full"
                >
                  👤 Login como Admin
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleLogin("member", "dev-member-456")}
                  className="w-full"
                >
                  👤 Login como Member
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogin("guest", "dev-guest-789")}
                  className="w-full"
                >
                  👤 Login como Guest
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                ⚠️ Apenas para desenvolvimento
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
