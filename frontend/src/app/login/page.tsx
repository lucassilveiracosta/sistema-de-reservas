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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10">
        <h2 className="text-3xl font-extrabold text-indigo-900 text-center mb-8">Bem-vindo(a)</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-indigo-800 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-indigo-800 mb-2">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-xl bg-indigo-600 text-white font-bold tracking-wide shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar na Conta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta? <a href="#" className="text-indigo-600 hover:underline">Fale com um admin</a>.
        </p>
      </div>
    </main>
  );
}
