"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, Menu, X } from "lucide-react";

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
      <aside className={`
        w-72 bg-slate-950 h-screen fixed left-0 top-0 text-white flex flex-col border-r border-slate-800 z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-50 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-xl italic">UPTOWN</span>
          </div>
          {/* <span className="text-xl font-bold tracking-tight">UpTown<span className="text-indigo-500">.</span></span> */}
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 px-4">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-900">
          <Link 
            href="/leads/new" 
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            <PlusCircle size={16} /> Quick Add
          </Link>
        </div>
      </aside>
    </>
  );
}