import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import LeadsTable from "@/components/leads/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await connectDB();

  // .lean() makes the query faster and the object cleaner for React
  const leadsRaw = await Lead.find({}).sort({ createdAt: -1 }).lean();

  // SERIALIZATION FIX: Converts MongoDB IDs and Dates to plain strings
  const leads = JSON.parse(JSON.stringify(leadsRaw));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
        <p className="text-slate-500 font-medium">Manage your sales pipeline.</p>
      </div>

      <LeadsTable initialLeads={leads} />
    </div>
  );
}