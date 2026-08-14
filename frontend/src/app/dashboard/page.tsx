"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import ReservationModal from "@/components/ReservationModal";

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  const handleReservationSuccess = () => {
    setSelectedRoom(null);
    alert("Reserva concluída com sucesso!");
    // Aqui poderíamos recarregar as salas ou reservas, caso o dashboard as mostrasse
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8 md:p-16">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">Dashboard</h1>
        <button onClick={handleLogout} className="px-6 py-2 rounded-full border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors">
          Sair
        </button>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-slate-700 mb-6">Salas Disponíveis</h2>
        
        {loading && <p className="text-slate-500 animate-pulse">Buscando salas...</p>}
        {error && <p className="text-red-500 p-4 bg-red-50 rounded-xl">{error}</p>}
        
        {!loading && !error && rooms.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
            <p className="text-slate-500">Nenhuma sala cadastrada ainda.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">{room.name}</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {room.capacity} pessoas
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{room.description || "Sem descrição"}</p>
              
              <button 
                onClick={() => setSelectedRoom(room)}
                className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors"
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
  );
}
