"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import ReservationModal from "@/components/ReservationModal";
import Header from "@/components/Header";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { Star } from "lucide-react";

export default function Dashboard() {
  const [rooms, setRooms] = useState<{id: string, name: string, capacity: number, description?: string}[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    Promise.all([
      fetchWithAuth("/room"),
      fetchWithAuth("/user/favorites")
    ]).then(([roomsData, favoritesData]) => {
      if (Array.isArray(roomsData)) setRooms(roomsData);
      else setRooms([]);
      
      if (Array.isArray(favoritesData)) {
        setFavorites(favoritesData.map((f: any) => f.roomId));
      }
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (roomId: string) => {
    const isFav = favorites.includes(roomId);
    
    if (isFav) setFavorites(prev => prev.filter(id => id !== roomId));
    else setFavorites(prev => [...prev, roomId]);

    try {
      if (isFav) {
        await fetchWithAuth(`/user/favorites/${roomId}`, { method: "DELETE" });
      } else {
        await fetchWithAuth(`/user/favorites/${roomId}`, { method: "POST" });
      }
    } catch (err) {
      if (isFav) setFavorites(prev => [...prev, roomId]);
      else setFavorites(prev => prev.filter(id => id !== roomId));
      alert("Erro ao atualizar favorito.");
    }
  };

  const handleReservationSuccess = () => {
    setSelectedRoom(null);
    alert("Reserva concluída com sucesso!");
    // O calendário já possui auto-refresh, mas recarregar a página ou notificar é bom
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-blue-50 text-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto p-8 md:p-12">
      
      <WeeklyCalendar />

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
          {[...rooms].sort((a, b) => {
            const aFav = favorites.includes(a.id);
            const bFav = favorites.includes(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return a.name.localeCompare(b.name);
          }).map(room => (
            <div key={room.id} className={`bg-white p-6 rounded-lg shadow-sm border ${favorites.includes(room.id) ? 'border-yellow-300 shadow-yellow-100' : 'border-slate-100'} hover:shadow-xl transition-all duration-300 group`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{room.name}</h3>
                  <button 
                    onClick={() => toggleFavorite(room.id)} 
                    className="text-slate-300 hover:text-yellow-400 hover:scale-110 transition-all focus:outline-none"
                    title={favorites.includes(room.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Star size={20} className={favorites.includes(room.id) ? "fill-yellow-400 text-yellow-400" : ""} />
                  </button>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold">
                  {room.capacity} pessoas
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{room.description || "Sem descrição"}</p>
              
              <button 
                onClick={() => setSelectedRoom(room)}
                className="w-full py-3 rounded-md bg-blue-50 text-blue-700 font-bold group-hover:bg-lime-500 group-hover:text-blue-900 shadow-sm transition-colors"
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
