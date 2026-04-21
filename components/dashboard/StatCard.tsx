export default function StatCard({ title, value, subtext, colorClass, trend }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      {/* Decorative Gradient Background */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${colorClass === 'text-green-600' ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
      
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
      
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className={`text-4xl font-extrabold tracking-tight ${colorClass || "text-slate-900"}`}>
          {value}
        </h3>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            ↑ {trend}
          </span>
        )}
      </div>
      
      {subtext && <p className="text-sm text-slate-400 mt-2 font-medium">{subtext}</p>}
    </div>
  );
}