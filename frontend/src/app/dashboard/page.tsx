"use client";
import { useEffect, useState, useMemo } from "react";
import { fetchWithAuth } from "@/services/api";
import Header from "@/components/Header";
import { BarChart3, CheckCircle, Clock, XCircle, Home as RoomIcon, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users } from "lucide-react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Statistics {
  overview: {
    totalRooms: number;
    totalUsers: number;
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
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
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

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const reservationsForSelectedDate = useMemo(() => {
    if (!stats) return [];
    return stats.upcomingReservations.filter(res => isSameDay(new Date(res.startTime), selectedDate));
  }, [stats, selectedDate]);

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
            <p className="text-slate-500 font-medium mt-1">Estatísticas e Calendário de Agendamentos</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-full"><Users size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Usuários</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.totalUsers}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><RoomIcon size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Salas Ativas</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.totalRooms}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-lime-50 text-lime-600 rounded-full"><Clock size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Reservas Ativas</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.active}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full"><CheckCircle size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Reservas Concluídas</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.completed}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-500 rounded-full"><XCircle size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Cancelamentos</p>
                  <p className="text-3xl font-extrabold text-blue-900">{stats.overview.reservations.cancelled}</p>
                </div>
              </div>

            </div>

            {/* Calendar & Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Calendar */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-900 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronLeft size={20} className="text-slate-600"/></button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronRight size={20} className="text-slate-600"/></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs font-bold text-slate-400 py-2">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const hasReservation = stats.upcomingReservations.some(r => isSameDay(new Date(r.startTime), day));

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all
                          ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                          ${isSelected ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-100'}
                          ${isToday && !isSelected ? 'bg-blue-50 text-blue-600' : ''}
                        `}
                      >
                        {format(day, 'd')}
                        {hasReservation && !isSelected && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 bg-lime-500 rounded-full"></span>
                        )}
                        {hasReservation && isSelected && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Details */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon size={24} className="text-blue-900" />
                  <h2 className="text-xl font-bold text-blue-900">
                    Agendamentos de {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </h2>
                </div>

                {reservationsForSelectedDate.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                    <CheckCircle size={48} className="mb-4 opacity-20" />
                    <p className="text-lg">Nenhum agendamento para este dia.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-4">Horário</th>
                          <th className="pb-4">Sala</th>
                          <th className="pb-4">Solicitante</th>
                          <th className="pb-4">Motivo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {reservationsForSelectedDate.map(res => {
                          const start = new Date(res.startTime);
                          const end = new Date(res.endTime);
                          return (
                            <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 font-semibold text-blue-600">
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

          </div>
        )}
      </main>
    </div>
  );
}
