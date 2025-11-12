"use client";

import { useState, useEffect } from "react";
import { IntentList } from "@/src/components/intents/IntentList";
import { IntentFilters } from "@/src/components/intents/IntentFilters";
import { DevAuthButton } from "@/src/components/auth/DevAuthButton";
import { intentsService } from "@/src/services";
import { Intent, IntentStatus } from "@/src/services/types";
import { isAdmin } from "@/src/utils/authUtils";

export default function AdminDashboard() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<IntentStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  });

  const ITEMS_PER_PAGE = 10;

  // Carregar intenções
  const loadIntents = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      // Só envia status se não for "ALL"
      if (currentStatus !== "ALL") {
        params.status = currentStatus;
      }

      const response = await intentsService.list(params);
      setIntents(response.items);

      // Calcular total de páginas
      const totalItems = response.meta.total || response.items.length;
      setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));

      // Atualizar estatísticas (isso virá do backend idealmente)
      // Por enquanto, vamos calcular localmente
      updateStats(response.items);
    } catch (error: any) {
      console.error("Erro ao carregar intenções:", error);
      console.error("Detalhes:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro ao carregar intenções. Tente novamente.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar estatísticas
  const updateStats = (items: Intent[]) => {
    // Nota: Idealmente isso viria do backend
    // Aqui é apenas uma simulação
    setStats({
      total: items.length,
      new: items.filter((i) => i.status === "NEW").length,
      reviewed: items.filter((i) => i.status === "REVIEWED").length,
      accepted: items.filter((i) => i.status === "ACCEPTED").length,
      rejected: items.filter((i) => i.status === "REJECTED").length,
    });
  };

  // Carregar ao montar e quando filtros mudarem
  useEffect(() => {
    loadIntents();
  }, [currentStatus, currentPage]);

  // Aceitar intenção
  const handleAccept = async (id: string) => {
    try {
      await intentsService.accept(id);
      await loadIntents(); // Recarregar lista
      alert("Intenção aceita com sucesso! Convite gerado.");
    } catch (error) {
      console.error("Erro ao aceitar intenção:", error);
      alert("Erro ao aceitar intenção. Tente novamente.");
    }
  };

  // Rejeitar intenção
  const handleReject = async (id: string) => {
    if (!confirm("Tem certeza que deseja rejeitar esta intenção?")) {
      return;
    }

    try {
      await intentsService.reject(id);
      await loadIntents(); // Recarregar lista
      alert("Intenção rejeitada.");
    } catch (error) {
      console.error("Erro ao rejeitar intenção:", error);
      alert("Erro ao rejeitar intenção. Tente novamente.");
    }
  };

  // Mudar filtro de status
  const handleStatusChange = (status: IntentStatus | "ALL") => {
    setCurrentStatus(status);
    setCurrentPage(1); // Resetar para primeira página
  };

  // Mudar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão de Dev Auth */}
      <DevAuthButton />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie as intenções de participação
              </p>
            </div>

            {/* Badge de admin */}
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              👤 Administrador
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-blue-600">Novas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.reviewed}
            </div>
            <div className="text-sm text-yellow-600">Revisadas</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.accepted}
            </div>
            <div className="text-sm text-green-600">Aceitas</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-red-600">Rejeitadas</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <IntentFilters
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            stats={stats}
          />
        </div>

        {/* Lista de intenções */}
        <IntentList
          intents={intents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={loading}
        />
      </main>
    </div>
  );
}
