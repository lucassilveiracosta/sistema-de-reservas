export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col space-y-8 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-900 tracking-tight">
          Sistema de Reservas
        </h1>
        <p className="text-xl text-indigo-700 max-w-2xl">
          Gerencie suas salas de reunião de forma simples, rápida e intuitiva.
        </p>
        
        <div className="flex gap-4 mt-8">
          <a
            href="/login"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Entrar
          </a>
        </div>
      </div>

      {/* Decorative element (Glassmorphism) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-white/30 backdrop-blur-3xl rounded-[3rem] -z-10 shadow-2xl border border-white/40 pointer-events-none"></div>
    </main>
  );
}
