"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/services/api";
import Header from "@/components/Header";
import { Plus, Edit2, Trash2, MapPin, Users } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({ name: "", capacity: 10, description: "" });
  const [formLoading, setFormLoading] = useState(false);

  // Security check: redirect non-admin users
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "ADMIN") {
      window.location.href = "/dashboard";
    } else {
      loadRooms();
    }
  }, []);

  const loadRooms = () => {
    setLoading(true);
    fetchWithAuth("/room")
      .then(data => {
        if (Array.isArray(data)) setRooms(data);
        else setRooms([]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditRoom(room);
      setFormData({ name: room.name, capacity: room.capacity, description: room.description || "" });
    } else {
      setEditRoom(null);
      setFormData({ name: "", capacity: 10, description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editRoom) {
        await fetchWithAuth(`/room/${editRoom.id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...formData, capacity: Number(formData.capacity) }),
        });
      } else {
        await fetchWithAuth("/room", {
          method: "POST",
          body: JSON.stringify({ ...formData, capacity: Number(formData.capacity) }),
        });
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (err: unknown) {
      if (err instanceof Error) alert("Erro ao salvar sala: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a sala "${name}"? Todas as reservas atreladas a ela poderão ser afetadas.`)) {
      try {
        await fetchWithAuth(`/room/${id}`, { method: "DELETE" });
        loadRooms();
      } catch (err: unknown) {
        if (err instanceof Error) alert("Erro ao excluir: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto p-8 md:p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Administração de Salas</h1>
            <p className="text-slate-500 mt-2 font-medium">Gerencie o catálogo de salas disponíveis para reservas.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} /> Nova Sala
          </button>
        </header>

        {loading && <p className="text-slate-500 animate-pulse font-medium">Carregando salas...</p>}
        {error && <p className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100 font-medium">{error}</p>}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-6 font-semibold">Nome da Sala</th>
                <th className="p-6 font-semibold hidden md:table-cell">Capacidade</th>
                <th className="p-6 font-semibold hidden lg:table-cell">Descrição</th>
                <th className="p-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map(room => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    {room.name}
                  </td>
                  <td className="p-6 text-slate-600 font-medium hidden md:table-cell">
                    <span className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" /> {room.capacity}
                    </span>
                  </td>
                  <td className="p-6 text-slate-500 text-sm hidden lg:table-cell max-w-xs truncate">
                    {room.description || "-"}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Sala"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id, room.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir Sala"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Nenhuma sala cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{editRoom ? "Editar Sala" : "Cadastrar Nova Sala"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Trash2 size={24} className="hidden" /> {/* just for spacing trick or we use lucide X */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Sala</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Sala Ada Lovelace"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Capacidade (Pessoas)</label>
                <input 
                  type="number" required min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição (Opcional)</label>
                <textarea 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Possui TV e quadro branco" rows={3}
                ></textarea>
              </div>
              <footer className="mt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit" disabled={formLoading} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50">
                  {formLoading ? "Salvando..." : "Salvar Sala"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
