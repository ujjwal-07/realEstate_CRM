import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  accent: string;       // tailwind bg color for icon bg, e.g. "bg-indigo-500"
  iconColor: string;    // tailwind text color for icon, e.g. "text-white"
  glow?: string;        // tailwind bg for glow blob, e.g. "bg-indigo-400"
  badge?: string;       // optional badge text
  badgeColor?: string;  // tailwind classes for badge
}

export default function StatCard({
  title, value, subtext, icon: Icon, accent, iconColor, glow, badge, badgeColor,
}: StatCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
      {/* Glow blob */}
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${glow || "bg-indigo-400"}`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor || "bg-emerald-50 text-emerald-600"}`}>
                {badge}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-400 mt-1.5 font-medium">{subtext}</p>}
        </div>
        <div className={`w-11 h-11 ${accent} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  );
}