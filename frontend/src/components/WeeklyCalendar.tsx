import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin } from "lucide-react";

interface Reservation {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  room: {
    name: string;
  };
  user: {
    name: string;
  };
}

export default function WeeklyCalendar() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Consider week starting on Monday
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start, end });

  const loadReservations = () => {
    setLoading(true);
    const startDateIso = start.toISOString();
    const endDateIso = end.toISOString();
    
    // Buscar apenas ativas (o backend pode retornar canceladas dependendo de como foi feito, mas vamos filtrar no frontend por garantia)
    fetchWithAuth(`/reservation?startDate=${startDateIso}&endDate=${endDateIso}`)
      .then(data => {
        if (Array.isArray(data)) {
          setReservations(data.filter(r => r.status === "ACTIVE"));
        } else {
          setReservations([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
    // Refresh periodicamente para que o usuário veja novas reservas se deixar o dashboard aberto
    const interval = setInterval(loadReservations, 60000); 
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Agenda da Semana</h2>
          <p className="text-sm text-slate-500 font-medium">Visão geral de todas as salas ({format(start, "dd/MM")} a {format(end, "dd/MM")})</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 min-w-max">
          {daysOfWeek.map((day) => {
            const isToday = isSameDay(day, new Date());
            const dayReservations = reservations
              .filter(r => isSameDay(new Date(r.startTime), day))
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

            return (
              <div 
                key={day.toISOString()} 
                className={`w-64 flex-shrink-0 flex flex-col rounded-lg border ${isToday ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-slate-50'}`}
              >
                <div className={`p-3 border-b text-center ${isToday ? 'border-blue-200 bg-blue-100/50' : 'border-slate-200'}`}>
                  <h3 className={`font-bold text-sm uppercase tracking-wider ${isToday ? 'text-blue-700' : 'text-slate-600'}`}>
                    {format(day, "EEEE", { locale: ptBR })}
                  </h3>
                  <span className={`text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                    {format(day, "dd MMM", { locale: ptBR })}
                  </span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar">
                  {loading && dayReservations.length === 0 && (
                    <div className="animate-pulse flex space-x-2 p-2">
                      <div className="h-10 bg-slate-200 rounded w-full"></div>
                    </div>
                  )}

                  {!loading && dayReservations.length === 0 && (
                    <p className="text-xs text-center text-slate-400 font-medium py-4">Nenhuma reserva</p>
                  )}

                  {dayReservations.map(res => (
                    <div key={res.id} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                        <Clock size={10} /> {format(new Date(res.startTime), "HH:mm")} - {format(new Date(res.endTime), "HH:mm")}
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-tight truncate" title={res.title}>{res.title}</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                          <MapPin size={12} className="text-blue-500" /> {res.room?.name || "Sala"}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          Por {res.user?.name || "Colaborador"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
