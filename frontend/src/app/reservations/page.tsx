"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import Header from "@/components/Header";
import { Calendar, Clock, MapPin, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Reservation {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  room: {
    id: string;
    name: string;
  };
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadReservations = () => {
    setLoading(true);
    fetchWithAuth("/reservation/history")
      .then(data => {
        if (Array.isArray(data)) setReservations(data);
        else setReservations([]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelLoading(true);
    try {
      await fetchWithAuth(`/reservation/${cancelId}/cancel`, { method: "PATCH" });
      setCancelId(null);
      loadReservations();
    } catch (err: unknown) {
      if (err instanceof Error) alert("Erro ao cancelar: " + err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto p-8 md:p-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Minhas Reservas</h1>
          <p className="text-slate-500 mt-2 font-medium">Acompanhe seu histórico de agendamentos de salas.</p>
        </header>

        {loading && <p className="text-slate-500 animate-pulse font-medium">Carregando histórico...</p>}
        {error && <p className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100 font-medium">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <Calendar size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Você ainda não tem nenhuma reserva agendada.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(res => {
            const start = new Date(res.startTime);
            const end = new Date(res.endTime);
            const isActive = res.status === "ACTIVE";
            const isPast = end < new Date();

            return (
              <div key={res.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-indigo-900 truncate pr-2" title={res.title}>{res.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    !isActive ? "bg-red-50 text-red-700" :
                    isPast ? "bg-slate-100 text-slate-600" : "bg-green-50 text-green-700"
                  }`}>
                    {!isActive ? "CANCELADA" : isPast ? "CONCLUÍDA" : "ATIVA"}
                  </span>
                </div>

                <div className="space-y-3 flex-1 mb-6">
                  <p className="flex items-center text-slate-600 font-medium text-sm gap-2">
                    <MapPin size={16} className="text-slate-400" /> {res.room?.name || "Sala Removida"}
                  </p>
                  <p className="flex items-center text-slate-600 font-medium text-sm gap-2">
                    <Calendar size={16} className="text-slate-400" /> {format(start, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                  <p className="flex items-center text-slate-600 font-medium text-sm gap-2">
                    <Clock size={16} className="text-slate-400" /> {format(start, "HH:mm")} às {format(end, "HH:mm")}
                  </p>
                </div>

                {isActive && !isPast && (
                  <div className="pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setCancelId(res.id)}
                      className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <XCircle size={16} /> Cancelar Reserva
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <XCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cancelar Reserva?</h3>
            <p className="text-slate-500 text-sm mb-6">Tem certeza que deseja cancelar esta reserva? Essa ação liberará a sala para outros colaboradores.</p>
            
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setCancelId(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelLoading ? "Cancelando..." : "Sim, Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
