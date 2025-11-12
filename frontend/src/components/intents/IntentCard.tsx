"use client";

import { Intent } from "@/src/services/types";
import { Button } from "@/src/components/common";

interface IntentCardProps {
  intent: Intent;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels = {
  NEW: "Nova",
  REVIEWED: "Revisada",
  ACCEPTED: "Aceita",
  REJECTED: "Rejeitada",
};

export function IntentCard({
  intent,
  onAccept,
  onReject,
  loading,
}: IntentCardProps) {
  const canTakeAction = intent.status === "NEW" || intent.status === "REVIEWED";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header com status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{intent.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(intent.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[intent.status]
          }`}
        >
          {statusLabels[intent.status]}
        </span>
      </div>

      {/* Informações de contato */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-700">{intent.email}</span>
        </div>

        {intent.phone && (
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-gray-700">{intent.phone}</span>
          </div>
        )}

        {intent.source && (
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-gray-700 capitalize">{intent.source}</span>
          </div>
        )}
      </div>

      {/* Mensagem */}
      {intent.message && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 italic border-l-4 border-gray-300 pl-3">
            "{intent.message}"
          </p>
        </div>
      )}

      {/* Ações */}
      {canTakeAction && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAccept(intent.id)}
            disabled={loading}
            loading={loading}
            className="flex-1"
          >
            ✓ Aceitar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReject(intent.id)}
            disabled={loading}
            className="flex-1"
          >
            ✗ Recusar
          </Button>
        </div>
      )}

      {intent.status === "ACCEPTED" && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-green-600 font-medium">
            ✓ Convite enviado com sucesso
          </p>
        </div>
      )}

      {intent.status === "REJECTED" && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-red-600 font-medium">
            ✗ Intenção rejeitada
          </p>
        </div>
      )}
    </div>
  );
}
