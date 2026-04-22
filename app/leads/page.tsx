import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import LeadsTable from "@/components/leads/LeadsTable";

// 1. Force the route to be dynamic - This fixes the 'Dynamic server usage' error
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  try {
    // 2. Connect directly to MongoDB
    await connectDB();

    // 3. Query the database directly (No fetch, no localhost, no problem)
    // We use .lean() to get raw JS objects instead of heavy Mongoose documents
    const leadsRaw = await Lead.find({}).sort({ createdAt: -1 }).lean();

    // 4. SERIALIZATION: Convert MongoDB IDs and Dates into strings
    // This is mandatory to pass data from a Server Component to a Client Component
    const leads = JSON.parse(JSON.stringify(leadsRaw));

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-500 font-medium">Real-time pipeline management.</p>
        </div>

        {/* 5. Pass the clean data to your table */}
        <LeadsTable initialLeads={leads} />
      </div>
    );
  } catch (error) {
    console.error("Build/Runtime Error:", error);
    return (
      <div className="p-10 text-center bg-red-50 rounded-2xl border border-red-100">
        <h2 className="text-red-600 font-bold">Failed to load leads</h2>
        <p className="text-red-400 text-sm mt-1">Check your Vercel logs for database connection errors.</p>
      </div>
    );
  }
}