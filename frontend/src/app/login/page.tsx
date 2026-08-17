"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchWithAuth("/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.user) {
          localStorage.setItem("user_role", data.user.role);
          localStorage.setItem("user_name", data.user.name);
        }
        window.location.href = "/dashboard";
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert("Erro ao fazer login: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-lg shadow-lg border border-white/50 p-10">
        <h2 className="text-3xl font-extrabold text-blue-900 text-center mb-8">Bem-vindo(a)</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-md bg-blue-600 text-white font-bold tracking-wide shadow-lg hover:bg-blue-700 hover:shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar na Conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
