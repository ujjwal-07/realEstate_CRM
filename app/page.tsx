import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import StatCard from "@/components/dashboard/StatCard";

// CRITICAL: Ensures fresh data in production
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectDB();

  // Aggregate data directly from MongoDB
  const [totalLeads, statusStats, sourceStats] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
  ]);

  const closedCount = statusStats.find(s => s._id === "Closed")?.count || 0;
  const conversionRate = totalLeads > 0 ? ((closedCount / totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance</h1>
        <p className="text-slate-500 font-medium">Real-time CRM insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value={totalLeads} subtext="Captured in pipeline" />
        <StatCard 
          title="Conversion" 
          value={`${conversionRate}%`} 
          colorClass="text-emerald-600" 
          subtext="Closed deal ratio" 
        />
        <StatCard 
          title="Hot Leads" 
          value={statusStats.find(s => s._id === "Site Visit")?.count || 0} 
          colorClass="text-indigo-600" 
          subtext="Active site visits" 
        />
      </div>

      {/* You can add your Distribution Charts below using the sourceStats and statusStats data */}
    </div>
  );
}