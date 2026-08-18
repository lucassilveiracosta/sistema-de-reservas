import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-900 relative overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col space-y-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <Image src="/img/ADA.png" alt="ReservADA Logo" width={96} height={96} className="rounded-xl object-contain drop-shadow-md bg-white p-2" />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            ReservADA
          </h1>
        </div>
        
        <div className="flex gap-4 mt-8">
          <a
            href="/login"
            className="px-8 py-3 rounded-md bg-lime-500 text-blue-900 font-bold shadow-lg hover:bg-lime-400 hover:shadow-slate-200 hover:-translate-y-0.5 transition-all duration-200"
          >
            Entrar
          </a>
        </div>
      </div>

      {/* Decorative element (Glassmorphism) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-white/30 backdrop-blur-3xl rounded-[3rem] -z-10 shadow-lg border border-white/40 pointer-events-none"></div>
    </main>
  );
}
