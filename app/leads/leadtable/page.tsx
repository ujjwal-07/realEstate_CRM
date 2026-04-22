import LeadsTable from "@/components/leads/LeadsTable";
import { Lead } from "@/types";
import connectDB from "@/lib/db";
import LeadModel from "@/models/Lead";

// Query the DB directly — no internal HTTP fetch needed in a Server Component.
// Calling fetch("http://localhost:3000/...") breaks on Vercel because
// localhost doesn't exist there, and forces dynamic rendering.
async function getLeads(): Promise<Lead[]> {
  try {
    await connectDB();
    const leads = await LeadModel.find({}).sort({ createdAt: -1 }).lean();
    // Mongoose documents are not plain objects; .lean() + JSON round-trip
    // converts them so they are safe to pass to Client Components.
    return JSON.parse(JSON.stringify(leads));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

// Server Component — fetches data at request time on Vercel (dynamic route)
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500">Manage your real estate inquiries.</p>
      </div>

      {/* Pass the data into your Client Component */}
      <LeadsTable initialLeads={leads} />
    </div>
  );
}