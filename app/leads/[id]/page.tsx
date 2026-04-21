import { Lead } from "@/types";
import LeadDetail from "@/components/leads/LeadDetails";
import Link from "next/link";
import { notFound } from "next/navigation";

// Server-side fetch for the specific lead
async function getLead(id: string): Promise<Lead | null> {

    console.log(id, " this is id")
  try {
    const res = await fetch(`http://localhost:3000/api/leads/${id}`, {
      cache: "no-store", 
    });

    console.log(res, "this is repsonse")

    if (!res.ok) return null;
    const json = await res.json();
    console.log(json.data , "this is jsondata")
    return json.data;
  } catch (error) {
    console.error("Error fetching lead:", error);
    return null;
  }
}

// THE FIX IS HERE: Await the params promise before reading params.id
export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lead = await getLead(resolvedParams.id);

  // If the ID is invalid or deleted, show Next.js standard 404 page
  if (!lead) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/leads/leadtable" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          ← Back to Leads
        </Link>
      </div>

      <LeadDetail initialLead={lead} />
    </div>
  );
}