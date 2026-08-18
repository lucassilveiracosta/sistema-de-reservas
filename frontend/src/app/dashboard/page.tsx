"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import Header from "@/components/Header";
import { BarChart3, CheckCircle, Clock, XCircle, Home as RoomIcon } from "lucide-react";

interface Statistics {
  overview: {
    totalRooms: number;
    reservations: {
      active: number;
      completed: number;
      cancelled: number;
      total: number;
    };
  };
  upcomingReservations: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    room: { name: string };
    user: { name: string };
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Basic role protection check in frontend
    const role = localStorage.getItem("user_role");
    if (role !== "ADMIN") {
      window.location.href = "/salas";
      return;
    }

    fetchWithAuth("/dashboard/statistics")
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 text-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-blue-900 font-bold text-xl">Carregando métricas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-slate-900 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto w-full p-8 md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <BarChart3 size={32} className="text-lime-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Visão Geral</h1>
            <p className="text-slate-500 font-medium mt-1">Acompanhe os números e o engajamento do ReservADA</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-10">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                  <RoomIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Salas Ativas</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.totalRooms}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-lime-50 text-lime-600 rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Agendamentos Futuros</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.active}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Reservas Concluídas</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.completed}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-500 rounded-full">
                  <XCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Cancelamentos</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.cancelled}</p>
                </div>
              </div>

            </div>

            {/* Upcoming Reservations List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-blue-900 mb-6">Próximos Agendamentos (7 dias)</h2>
              
              {stats.upcomingReservations.length === 0 ? (
                <p className="text-slate-500 italic">Nenhum agendamento futuro para os próximos 7 dias.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-4">Data e Hora</th>
                        <th className="pb-4">Sala</th>
                        <th className="pb-4">Solicitante</th>
                        <th className="pb-4">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {stats.upcomingReservations.map(res => {
                        const start = new Date(res.startTime);
                        const end = new Date(res.endTime);
                        return (
                          <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 font-semibold text-slate-700">
                              {start.toLocaleDateString('pt-BR')} <span className="text-blue-500 mx-1">•</span> 
                              {start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} 
                              {' - '}
                              {end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="py-4 font-bold text-blue-900">{res.room.name}</td>
                            <td className="py-4 text-slate-600">{res.user.name}</td>
                            <td className="py-4 text-slate-500">{res.title}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
