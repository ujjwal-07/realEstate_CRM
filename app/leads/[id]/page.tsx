import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import LeadDetail from "@/components/leads/LeadDetails";

export const dynamic = "force-dynamic";

// Next.js 15: Params must be handled as a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  await connectDB();
  
  // Fetch single lead by ID
  const leadRaw = await Lead.findById(id).lean();

  if (!leadRaw) {
    notFound(); // Triggers the 404 page if ID is invalid
  }

  // SERIALIZATION FIX: Prevents "Server Component render" crash
  const lead = JSON.parse(JSON.stringify(leadRaw));

  return (
    <div className="py-4">
      <LeadDetail initialLead={lead} />
    </div>
  );
}