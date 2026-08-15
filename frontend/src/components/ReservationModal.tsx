"use client";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/services/api";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, addDays, addMonths, subMonths 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

interface ReservationModalProps {
  room: { id: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationModal({ room, onClose, onSuccess }: ReservationModalProps) {
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Time blocks states
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [occupiedBlocks, setOccupiedBlocks] = useState<string[]>([]);
  
  // Form states
  const [title, setTitle] = useState("");
  const [selectedStartBlock, setSelectedStartBlock] = useState("");
  const [selectedEndBlock, setSelectedEndBlock] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingDay, setFetchingDay] = useState(false);
  const [error, setError] = useState("");

  // Generate fixed blocks from 08:00 to 17:00
  const allBlocks = Array.from({ length: 10 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const loadDaySchedule = async (date: Date) => {
    setFetchingDay(true);
    setOccupiedBlocks([]);
    setSelectedStartBlock("");
    setSelectedEndBlock("");
    setError("");

    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const res = await fetchWithAuth(`/reservation?roomId=${room.id}&startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`);
      
      const occupied: string[] = [];
      
      if (Array.isArray(res)) {
        res.forEach(reservation => {
          const resStart = new Date(reservation.startTime);
          const resEnd = new Date(reservation.endTime);
          
          allBlocks.forEach(block => {
            const [hour, minute] = block.split(':');
            const blockStart = new Date(date);
            blockStart.setHours(parseInt(hour), parseInt(minute), 0, 0);
            
            const blockEnd = new Date(date);
            blockEnd.setHours(parseInt(hour) + 1, parseInt(minute), 0, 0);
            
            if (resStart < blockEnd && resEnd > blockStart) {
              occupied.push(block);
            }
          });
        });
      }
      
      setOccupiedBlocks(occupied);
      setAvailableBlocks(allBlocks);
    } catch (err) {
      console.error("Erro ao buscar horários", err);
      setError("Erro ao carregar horários disponíveis da sala.");
    } finally {
      setFetchingDay(false);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    loadDaySchedule(day);
  };

  const getValidEndTimes = () => {
    if (!selectedStartBlock) return [];
    
    const startIndex = allBlocks.indexOf(selectedStartBlock);
    if (startIndex === -1) return [];

    const validEnds = [];
    for (let i = startIndex; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      const endHour = parseInt(block.split(':')[0]) + 1;
      const endStr = `${endHour.toString().padStart(2, '0')}:00`;
      
      validEnds.push(endStr);
      
      if (i + 1 < allBlocks.length && occupiedBlocks.includes(allBlocks[i + 1])) {
        break;
      }
    }
    
    return validEnds;
  };

  const validEndTimes = getValidEndTimes();

  useEffect(() => {
    if (selectedStartBlock && !validEndTimes.includes(selectedEndBlock)) {
      setSelectedEndBlock(validEndTimes[0] || "");
    }
  }, [selectedStartBlock, validEndTimes, selectedEndBlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedStartBlock || !selectedEndBlock || !title) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const startDateTime = new Date(`${formattedDate}T${selectedStartBlock}:00`);
      const endDateTime = new Date(`${formattedDate}T${selectedEndBlock}:00`);

      await fetchWithAuth("/reservation", {
        method: "POST",
        body: JSON.stringify({
          title,
          roomId: room.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <h4 className="font-bold text-slate-800 capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
      </h4>
      <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-xs text-slate-400 py-2 uppercase">
          {format(addDays(startDate, i), 'EEEEEE', { locale: ptBR })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isPast = day < today;

        days.push(
          <button
            type="button"
            key={day.toString()}
            disabled={!isCurrentMonth || isPast}
            onClick={() => handleDayClick(cloneDay)}
            className={`p-2 w-full flex justify-center items-center h-10 text-sm rounded-md transition-all font-medium
              ${!isCurrentMonth || isPast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}
              ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 bg-slate-900/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2">
              <CalendarIcon className="text-blue-600" /> Agendar Sala
            </h2>
            <p className="text-sm text-blue-600/80 font-semibold mt-1 flex items-center gap-1">
              {room.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-md hover:bg-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-8 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                <h3 className="text-lg font-bold text-slate-800">Escolha a Data</h3>
              </div>
              
              <div className="border border-slate-200 rounded-md p-6 bg-white shadow-sm">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                  <h3 className="text-lg font-bold text-slate-800">Escolha o Horário</h3>
                </div>

                {!selectedDate ? (
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-slate-400 text-center">
                    <CalendarIcon size={32} className="mb-3 opacity-50" />
                    <p className="font-medium text-sm">Selecione uma data no calendário primeiro.</p>
                  </div>
                ) : fetchingDay ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-md animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                        <Clock size={16} /> Horário de Início
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {allBlocks.map(block => {
                          const isOccupied = occupiedBlocks.includes(block);
                          const isSelected = selectedStartBlock === block;
                          return (
                            <button
                              key={`start-${block}`}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setSelectedStartBlock(block)}
                              className={`
                                py-2 px-1 text-sm font-bold rounded-md border transition-all
                                ${isOccupied ? 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed line-through' : 
                                  isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-1' : 
                                  'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50'}
                              `}
                            >
                              {block}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedStartBlock && (
                      <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-500" /> Horário de Término
                        </p>
                        <select 
                          className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 shadow-sm"
                          value={selectedEndBlock}
                          onChange={(e) => setSelectedEndBlock(e.target.value)}
                        >
                          {validEndTimes.map(end => (
                            <option key={end} value={end}>{end}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedEndBlock && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
                    <h3 className="text-lg font-bold text-slate-800">Detalhes</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Motivo / Título da Reunião</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 shadow-sm placeholder:text-slate-300"
                      placeholder="Ex: Alinhamento de Produto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-md bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selectedDate || !selectedStartBlock || !selectedEndBlock || !title.trim()}
            className="px-8 py-3 rounded-md bg-blue-600 text-white font-bold tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-md animate-spin"></div>
            ) : "Confirmar Reserva"}
          </button>
        </footer>
      </div>
    </div>
  );
}
