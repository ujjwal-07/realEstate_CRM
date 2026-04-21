"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leadSchema } from "@/lib/validation";

// Infer the TypeScript type directly from our Zod schema
type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: "New",
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create lead");
      }

      // Success: Redirect back to leads table and refresh
      alert("Data inserted successfully")
      router.push("/");
      router.refresh(); 
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              {...register("phone")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+91 9876543210"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register("email")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹) *</label>
            <input
              type="number"
              {...register("budget", { valueAsNumber: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="5000000"
            />
            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location *</label>
            <input
              {...register("location")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Andheri West"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
            <select
              {...register("propertyType")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select type...</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
            {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source *</label>
            <select
              {...register("source")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select source...</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-6">
          <button
            type="button"
            onClick={() => router.push("/leads")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}