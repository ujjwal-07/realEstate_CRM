import LeadsTable from "@/components/leads/LeadsTable";
import { Lead } from "@/types";

// 1. The Fetch Function: Reaches out to your Node.js API
async function getLeads(): Promise<Lead[]> {
  try {
    // We use absolute URL because this runs on the server
    const res = await fetch("http://localhost:3000/api/leads", {
      cache: "no-store", // Forces Next.js to always fetch fresh data, never cache
    });

    if (!res.ok) {
      console.error("Failed to fetch leads");
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

// 2. The Page Component (Server Component)
export default async function LeadsPage() {
  // 3. Call the fetch function BEFORE rendering the UI
  const leads = await getLeads();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500">Manage your real estate inquiries.</p>
      </div>

      {/* 4. Pass the data into your Client Component */}
      <LeadsTable initialLeads={leads} />
    </div>
  );
}