"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Lead } from "@/types";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  MapPin, 
  IndianRupee, 
  Phone, 
  ExternalLink 
} from "lucide-react";

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...initialLeads];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (l) => l.name.toLowerCase().includes(lowerSearch) || l.phone.includes(searchTerm)
      );
    }
    if (statusFilter) result = result.filter((l) => l.status === statusFilter);
    if (sourceFilter) result = result.filter((l) => l.source === sourceFilter);

    result.sort((a, b) => {
      if (sortBy === "budget-desc") return b.budget - a.budget;
      if (sortBy === "budget-asc") return a.budget - b.budget;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [initialLeads, searchTerm, statusFilter, sourceFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search leads by name or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select 
            className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Site Visit">Site Visit</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500"
            value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="budget-desc">Highest Budget</option>
          </select>

          <Link href="/leads/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={18} /> Add Lead
          </Link>
        </div>
      </div>

      {/* Modern Table — horizontally scrollable on mobile */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Information</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Property & Budget</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Source</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAndSortedLeads.map((lead) => (
              <tr key={lead._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <Link href={`/leads/${lead._id}`} className="block">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                      <Phone size={12} /> {lead.phone}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 text-slate-900 font-semibold text-sm">
                    <IndianRupee size={14} className="text-slate-400" /> {lead.budget.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                    <MapPin size={12} /> {lead.location} • {lead.propertyType}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'New' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    lead.status === 'Closed' ? 'bg-slate-100 text-slate-600' :
                    'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 font-medium">{lead.source}</td>
                <td className="px-6 py-5 text-right">
                   <Link href={`/leads/${lead._id}`} className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                    <ExternalLink size={18} />
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}