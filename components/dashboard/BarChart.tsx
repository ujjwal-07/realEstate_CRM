"use client";

interface BarChartProps {
  data: { label: string; count: number; color: string }[];
  total: number;
}

export default function BarChart({ data, total }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3 mt-2">
      {data.map((item) => {
        const pct = Math.round((item.count / total) * 100);
        const barW = Math.round((item.count / max) * 100);
        return (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              <span className="text-xs font-bold text-slate-500">
                {item.count} <span className="text-slate-300 font-normal">({pct}%)</span>
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${barW}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
