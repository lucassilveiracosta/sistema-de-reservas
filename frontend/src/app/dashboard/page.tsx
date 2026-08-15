"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import ReservationModal from "@/components/ReservationModal";
import Header from "@/components/Header";

export default function Dashboard() {
  const [rooms, setRooms] = useState<{id: string, name: string, capacity: number, description?: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    fetchWithAuth("/room")
      .then(data => {
        if (Array.isArray(data)) setRooms(data);
        else setRooms([]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReservationSuccess = () => {
    setSelectedRoom(null);
    alert("Reserva concluída com sucesso!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto p-8 md:p-12">

      <section>
        <h2 className="text-2xl font-bold text-slate-700 mb-6">Salas Disponíveis</h2>
        
        {loading && <p className="text-slate-500 animate-pulse">Buscando salas...</p>}
        {error && <p className="text-red-500 p-4 bg-red-50 rounded-md">{error}</p>}
        
        {!loading && !error && rooms.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-500">Nenhuma sala cadastrada ainda.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{room.name}</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold">
                  {room.capacity} pessoas
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{room.description || "Sem descrição"}</p>
              
              <button 
                onClick={() => setSelectedRoom(room)}
                className="w-full py-3 rounded-md bg-blue-50 text-blue-700 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                Agendar Horário
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedRoom && (
        <ReservationModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </main>
    </div>
  );
}
