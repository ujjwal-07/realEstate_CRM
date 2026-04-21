import StatCard from "@/components/dashboard/StatCard";

async function getStats() {
  const res = await fetch("http://localhost:3000/api/dashboard", { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function DashboardPage() {
  const stats = await getStats();

  if (!stats) return <div className="p-8">Failed to load dashboard.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Real-time performance metrics.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value={stats.totalLeads} subtext="Lifetime leads captured" />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats.conversionRate}%`} 
          colorClass="text-green-600"
          subtext="Leads moved to 'Closed' status" 
        />
        <StatCard 
          title="Active Hot Leads" 
          value={stats.statusDistribution.find((s: any) => s._id === "Site Visit")?.count || 0} 
          colorClass="text-blue-600"
          subtext="Leads at Site Visit stage"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Leads by Source</h2>
          <div className="space-y-4">
            {stats.leadsBySource.map((s: any) => (
              <div key={s._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{s._id}</span>
                  <span className="text-gray-500">{s.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(s.count / stats.totalLeads) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Pipeline Status</h2>
          <div className="space-y-4">
            {stats.statusDistribution.map((s: any) => (
              <div key={s._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{s._id}</span>
                  <span className="text-gray-500">{s.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(s.count / stats.totalLeads) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}