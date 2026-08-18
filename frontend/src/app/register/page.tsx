"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        ...(cpf && { cpf }),
      };

      await fetchWithAuth("/user/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Cadastro realizado com sucesso! Faça seu login.");
      window.location.href = "/login";
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert("Erro no cadastro: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-blue-900">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-white/50 p-10 mt-10 mb-10">
        <h2 className="text-3xl font-extrabold text-blue-900 text-center mb-8">Criar Conta</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">CPF <span className="text-slate-400 font-normal">(Opcional)</span></label>
            <input 
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="123.456.789-00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Confirmação de Senha</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-md bg-lime-500 text-blue-900 font-extrabold tracking-wide shadow-lg hover:bg-lime-400 hover:shadow-lime-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Já possui uma conta?{" "}
            <a 
              href="/login" 
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Fazer Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
