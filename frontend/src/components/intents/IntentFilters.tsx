"use client";

import { IntentStatus } from "@/src/services/types";

interface IntentFiltersProps {
  currentStatus: IntentStatus | "ALL";
  onStatusChange: (status: IntentStatus | "ALL") => void;
  stats?: {
    total: number;
    new: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}

// Status em maiúsculas conforme OpenAPI spec
const filters = [
  { value: "ALL", label: "Todas", color: "bg-gray-100 text-gray-800" },
  { value: "NEW", label: "Novas", color: "bg-blue-100 text-blue-800" },
  {
    value: "REVIEWED",
    label: "Revisadas",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "ACCEPTED", label: "Aceitas", color: "bg-green-100 text-green-800" },
  { value: "REJECTED", label: "Rejeitadas", color: "bg-red-100 text-red-800" },
] as const;

export function IntentFilters({
  currentStatus,
  onStatusChange,
  stats,
}: IntentFiltersProps) {
  const getCount = (status: string) => {
    if (!stats) return 0;
    switch (status) {
      case "ALL":
        return stats.total;
      case "NEW":
        return stats.new;
      case "REVIEWED":
        return stats.reviewed;
      case "ACCEPTED":
        return stats.accepted;
      case "REJECTED":
        return stats.rejected;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Filtrar por status
      </h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = currentStatus === filter.value;
          const count = getCount(filter.value);

          return (
            <button
              key={filter.value}
              onClick={() =>
                onStatusChange(filter.value as IntentStatus | "ALL")
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? `${filter.color} ring-2 ring-offset-2 ring-blue-500`
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
              {stats && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
