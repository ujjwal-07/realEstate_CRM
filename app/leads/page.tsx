import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import LeadsTable from "@/components/leads/LeadsTable";

// 1. THIS IS THE MOST IMPORTANT LINE
// It tells Vercel: "Do not cache this page. Run the DB query every single time."
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  try {
    // 2. Connect directly to the DB
    await connectDB();

    // 3. Fetch leads directly using the Model
    // .lean() makes the data lightweight and faster
    const leadsRaw = await Lead.find({}).sort({ createdAt: -1 }).lean();

    // 4. SERIALIZATION: Converts MongoDB ObjectIDs to strings so React doesn't crash
    const leads = JSON.parse(JSON.stringify(leadsRaw));

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-500 font-medium">Manage your real-time pipeline.</p>
        </div>

        {/* 5. Pass data to the table */}
        <LeadsTable initialLeads={leads} />
      </div>
    );
  } catch (error) {
    console.error("Critical Production Error:", error);
    return (
      <div className="p-10 text-center bg-red-50 rounded-2xl border border-red-100">
        <h2 className="text-red-600 font-bold">Database Connection Failed</h2>
        <p className="text-red-400 text-sm mt-1">Check your MONGODB_URI in Vercel settings.</p>
      </div>
    );
  }
}