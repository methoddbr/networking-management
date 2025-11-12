"use client";

import { useState } from "react";
import { Intent, IntentStatus } from "@/src/services/types";
import { IntentCard } from "./IntentCard";
import { Button } from "@/src/components/common";

interface IntentListProps {
  intents: Intent[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  loading?: boolean;
}

export function IntentList({
  intents,
  currentPage,
  totalPages,
  onPageChange,
  onAccept,
  onReject,
  loading,
}: IntentListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    try {
      await onAccept(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await onReject(id);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (intents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma intenção encontrada
        </h3>
        <p className="text-gray-500">
          Não há intenções com o filtro selecionado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de cards */}
      <div className="grid gap-4">
        {intents.map((intent) => (
          <IntentCard
            key={intent.id}
            intent={intent}
            onAccept={handleAccept}
            onReject={handleReject}
            loading={actionLoading === intent.id}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Anterior
            </Button>

            {/* Números das páginas */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Mostra apenas páginas próximas
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
