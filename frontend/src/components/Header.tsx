"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
    setName(localStorage.getItem("user_name"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Salas Disponíveis", href: "/dashboard" },
    { label: "Minhas Reservas", href: "/reservations" },
  ];

  if (role === "ADMIN") {
    navItems.push({ label: "Administração", href: "/admin/rooms" });
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">S</span>
            ReservADA
          </h1>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{name || "Usuário"}</p>
            <p className="text-xs text-slate-500 font-medium">{role === "ADMIN" ? "Administrador" : "Colaborador"}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-5 py-2 rounded-md border border-slate-200 text-slate-600 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <nav className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 bg-slate-50 border-t border-slate-100 hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
