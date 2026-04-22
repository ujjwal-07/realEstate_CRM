"use client";

interface DonutChartProps {
  data: { label: string; count: number; color: string; textColor: string }[];
  total: number;
}

export default function DonutChart({ data, total }: DonutChartProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let cumulativePct = 0;

  const segments = data.map((item) => {
    const pct = total > 0 ? item.count / total : 0;
    const offset = circumference * (1 - cumulativePct);
    const dashLen = circumference * pct;
    cumulativePct += pct;
    return { ...item, pct, offset, dashLen };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
      {/* SVG Donut */}
      <div className="relative shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          {/* Track */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="18" />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${seg.dashLen} ${circumference}`}
              strokeDashoffset={-seg.offset + circumference}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">{total}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 flex-1 w-full">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{item.count}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: item.color + "22", color: item.color }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
