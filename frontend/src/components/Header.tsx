"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UserCircle } from "lucide-react";

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
    <header className="bg-blue-900 border-b border-blue-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <div className="bg-white p-1 rounded-md">
              <Image src="/img/ADA.png" alt="ReservADA Logo" width={28} height={28} className="object-contain" />
            </div>
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
                      ? "bg-lime-500 text-blue-900 shadow-sm" 
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <UserCircle size={32} strokeWidth={1.5} className="text-blue-300" />
            <div className="text-right">
              <p className="text-sm font-bold text-white">{name || "Usuário"}</p>
              <p className="text-xs text-blue-200 font-medium">{role === "ADMIN" ? "Administrador" : "Colaborador"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-5 py-2 rounded-md border border-blue-700 text-blue-100 font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <nav className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 bg-blue-800 border-t border-blue-700 hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive 
                  ? "bg-lime-500 text-blue-900 shadow-sm" 
                  : "bg-blue-900 border border-blue-800 text-blue-100"
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
