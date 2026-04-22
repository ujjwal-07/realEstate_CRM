"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Menu, X, Building2 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Leads", href: "/leads/leadtable", icon: Users },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          w-72 h-screen fixed left-0 top-0 flex flex-col z-40
          bg-slate-800 border-r border-slate-700/60
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight leading-none">Real Estate</span>
            <p className="text-indigo-400 text-[10px] font-semibold tracking-widest uppercase mt-0.5">CRM</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pt-6 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-3">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Add */}
        <div className="p-4 border-t border-slate-700/50">
          <Link
            href="/leads/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-700 hover:bg-indigo-600 border border-slate-600/50 hover:border-indigo-500 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200 shadow-sm"
          >
            <PlusCircle size={16} /> Quick Add Lead
          </Link>
        </div>
      </aside>
    </>
  );
}