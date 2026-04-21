import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import LeadDetail from "@/components/leads/LeadDetails";

// Forces the page to fetch fresh data every time (Prevents stale production data)
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  // 1. CRITICAL: You MUST await params in Next.js 15
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    await connectDB();
    
    // 2. Direct DB query using the awaited ID
    // .lean() is faster and returns a plain JS object
    const leadRaw = await Lead.findById(id).lean();

    if (!leadRaw) {
      console.error(`❌ Lead not found for ID: ${id}`);
      return notFound();
    }

    // 3. Serialization: Ensures MongoDB ObjectIDs don't crash the Client Component
    const lead = JSON.parse(JSON.stringify(leadRaw));

    return (
      <div className="py-4">
        <LeadDetail initialLead={lead} />
      </div>
    );
  } catch (error) {
    console.error("🔥 Error loading Lead Detail:", error);
    return (
      <div className="p-8 text-center">
        <h2 className="text-red-600 font-bold">Error loading lead</h2>
        <p className="text-slate-500">The ID might be malformed or the database is unreachable.</p>
      </div>
    );
  }
}