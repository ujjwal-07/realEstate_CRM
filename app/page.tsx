import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import StatCard from "@/components/dashboard/StatCard";
import BarChart from "@/components/dashboard/BarChart";
import DonutChart from "@/components/dashboard/DonutChart";
import { Users, TrendingUp, Flame, GitBranch } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectDB();

  const [totalLeads, statusStats, sourceStats, recentLeads] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
    Lead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const closedCount = statusStats.find((s) => s._id === "Closed")?.count || 0;
  const siteVisitCount = statusStats.find((s) => s._id === "Site Visit")?.count || 0;
  const conversionRate =
    totalLeads > 0 ? ((closedCount / totalLeads) * 100).toFixed(1) : "0";

  // --- Status distribution config ---
  const statusConfig: Record<string, { color: string; textColor: string }> = {
    New:         { color: "#10b981", textColor: "#059669" },
    Contacted:   { color: "#6366f1", textColor: "#4f46e5" },
    "Site Visit":{ color: "#f59e0b", textColor: "#d97706" },
    Closed:      { color: "#64748b", textColor: "#475569" },
    Lost:        { color: "#ef4444", textColor: "#dc2626" },
  };

  const statusChartData = statusStats
    .map((s) => ({
      label: s._id,
      count: s.count,
      color: statusConfig[s._id]?.color || "#94a3b8",
      textColor: statusConfig[s._id]?.textColor || "#64748b",
    }))
    .sort((a, b) => b.count - a.count);

  // --- Source distribution config ---
  const sourceColors: Record<string, string> = {
    Facebook: "bg-blue-500",
    Google:   "bg-red-400",
    Referral: "bg-emerald-500",
    Website:  "bg-indigo-500",
    Other:    "bg-slate-400",
  };

  const sourceChartData = sourceStats
    .map((s) => ({
      label: s._id,
      count: s.count,
      color: sourceColors[s._id] || "bg-slate-400",
    }))
    .sort((a, b) => b.count - a.count);

  // --- Status badge helper for recent leads ---
  const statusBadge: Record<string, string> = {
    New:          "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Contacted:    "bg-indigo-50 text-indigo-700 border border-indigo-100",
    "Site Visit": "bg-amber-50 text-amber-700 border border-amber-100",
    Closed:       "bg-slate-100 text-slate-600",
    Lost:         "bg-red-50 text-red-600 border border-red-100",
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time CRM performance overview</p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 self-start sm:self-auto"
        >
          + Add Lead
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          subtext="Captured in pipeline"
          icon={Users}
          accent="bg-indigo-600"
          iconColor="text-white"
          glow="bg-indigo-400"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtext={`${closedCount} closed deals`}
          icon={TrendingUp}
          accent="bg-emerald-500"
          iconColor="text-white"
          glow="bg-emerald-400"
          badge={Number(conversionRate) > 0 ? "Closed" : undefined}
          badgeColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Hot Leads"
          value={siteVisitCount}
          subtext="Active site visits"
          icon={Flame}
          accent="bg-amber-500"
          iconColor="text-white"
          glow="bg-amber-400"
        />
        <StatCard
          title="Unique Sources"
          value={sourceStats.length}
          subtext="Acquisition channels"
          icon={GitBranch}
          accent="bg-violet-600"
          iconColor="text-white"
          glow="bg-violet-400"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Status Distribution — Donut */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-black text-slate-900">Status Distribution</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pipeline breakdown by stage</p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
              {totalLeads} total
            </span>
          </div>
          <DonutChart data={statusChartData} total={totalLeads} />
        </div>

        {/* Leads by Source — Bar Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-black text-slate-900">Leads by Source</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Where your leads come from</p>
            </div>
            <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full border border-violet-100">
              {sourceStats.length} channels
            </span>
          </div>
          <BarChart data={sourceChartData} total={totalLeads} />
        </div>
      </div>

      {/* ── Conversion Highlight ── */}
      <div className="glass-card p-6 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/60 to-violet-50/40 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion Funnel</p>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {closedCount} of {totalLeads} leads converted to deals
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {totalLeads - closedCount} leads still in active pipeline
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-5xl font-black text-indigo-600">{conversionRate}%</span>
            <p className="text-xs text-slate-400 font-medium mt-1">Conversion Rate</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-5 h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${conversionRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-slate-400 font-medium">0%</span>
          <span className="text-[10px] text-slate-400 font-medium">100%</span>
        </div>
      </div>

      {/* ── Recent Leads ── */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">Recent Leads</h2>
            <p className="text-[11px] text-slate-400 font-medium">Latest 5 entries</p>
          </div>
          <Link
            href="/leads/leadtable"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentLeads.map((lead: any) => (
                <tr key={String(lead._id)} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/leads/${lead._id}`} className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">
                      {lead.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    ₹{(lead.budget as number).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusBadge[lead.status] || "bg-slate-100 text-slate-600"}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                    No leads yet. <Link href="/leads/new" className="text-indigo-600 font-bold hover:underline">Add your first lead →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}