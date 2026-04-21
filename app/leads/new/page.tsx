import LeadForm from "@/components/leads/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
        <p className="text-gray-500">Enter the details for the new real estate inquiry.</p>
      </div>

      <LeadForm />
    </div>
  );
}