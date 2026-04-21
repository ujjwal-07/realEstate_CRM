"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/types";
import { 
  User, Phone, Mail, Home, History, MessageSquare, 
  Edit3, Save, X, IndianRupee, MapPin, Trash2 
} from "lucide-react";

export default function LeadDetail({ initialLead }: { initialLead: Lead }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead>(initialLead);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // States for Lead Info Edit Mode
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialLead });

  // States for Notes CRUD
  const [newNote, setNewNote] = useState("");
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState("");

  // Generic Update Function (Shared by status, notes, and info edits)
  const updateLead = async (updateData: Partial<Lead>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const result = await res.json();
      if (res.ok) {
        setLead(result.data);
        setIsEditingInfo(false);
        router.refresh();
      } else {
        alert(result.error || "Update failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for Header Status Change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    updateLead({ status: e.target.value });

  // Handlers for Internal Notes
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    updateLead({ notes: [...(lead.notes || []), newNote] });
    setNewNote("");
  };

  const handleDeleteNote = (idx: number) => {
    if (confirm("Delete this note?")) {
      updateLead({ notes: (lead.notes || []).filter((_, i) => i !== idx) });
    }
  };

  const handleSaveNoteEdit = () => {
    if (editingNoteIndex === null) return;
    const updated = [...(lead.notes || [])];
    updated[editingNoteIndex] = editNoteText;
    updateLead({ notes: updated });
    setEditingNoteIndex(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header Card with Edit Toggle */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <User size={28} />
          </div>
          <div>
            {isEditingInfo ? (
              <input 
                className="text-2xl font-black text-slate-900 bg-slate-50 border-b-2 border-indigo-500 outline-none px-2 rounded"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            ) : (
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.name}</h1>
            )}
            <p className="text-sm text-slate-500 font-medium mt-1">Source: <span className="text-indigo-600 font-bold">{lead.source}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status Dropdown */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <select 
              value={lead.status} 
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-white border-none rounded-lg font-bold text-xs py-2 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Edit Info Button */}
          {isEditingInfo ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditingInfo(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <button onClick={() => updateLead(editForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md">
                <Save size={16} /> Save
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditingInfo(true)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Edit3 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left: Contact & Property Info */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-300">PHONE</p>
                {isEditingInfo ? (
                  <input className="w-full bg-slate-50 p-2 rounded-lg text-sm font-bold border-none" value={editForm.phone} onChange={(e)=>setEditForm({...editForm, phone:e.target.value})} />
                ) : (
                  <p className="text-sm font-bold flex items-center gap-2"><Phone size={14} className="text-indigo-500"/> {lead.phone}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-300">EMAIL</p>
                {isEditingInfo ? (
                  <input className="w-full bg-slate-50 p-2 rounded-lg text-sm font-bold border-none" value={editForm.email} onChange={(e)=>setEditForm({...editForm, email:e.target.value})} />
                ) : (
                  <p className="text-sm font-bold flex items-center gap-2 truncate"><Mail size={14} className="text-slate-400"/> {lead.email || "—"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Property Requirements</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-300">BUDGET</p>
                {isEditingInfo ? (
                  <input type="number" className="w-full bg-slate-50 p-2 rounded-lg text-sm font-bold border-none" value={editForm.budget} onChange={(e)=>setEditForm({...editForm, budget:Number(e.target.value)})} />
                ) : (
                  <p className="text-xl font-black text-slate-900 tracking-tight">₹{lead.budget.toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-300">LOCATION & TYPE</p>
                {isEditingInfo ? (
                  <div className="flex flex-col gap-2">
                    <input className="bg-slate-50 p-2 rounded-lg text-sm font-bold border-none" value={editForm.location} onChange={(e)=>setEditForm({...editForm, location:e.target.value})} />
                    <select className="bg-slate-50 p-2 rounded-lg text-sm font-bold border-none" value={editForm.propertyType} onChange={(e)=>setEditForm({...editForm, propertyType:e.target.value})}>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-indigo-600 flex items-center gap-2"><MapPin size={14}/> {lead.location} • {lead.propertyType}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Audit Trail & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Audit Trail Slider */}
          <div className="glass-card p-6 rounded-2xl flex flex-col h-[350px]">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 shrink-0">
              <History size={16} className="text-indigo-600" /> Audit Trail
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 mt-2">
                {lead.history?.slice().reverse().map((event, i) => (
                  <div key={i} className="pl-8 relative">
                    <div className="absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_8px_rgba(99,102,241,0.3)]"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{event.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{event.details}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {new Date(event.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Notes Slider */}
          <div className="glass-card p-6 rounded-2xl flex flex-col h-[400px]">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 shrink-0">
              <MessageSquare size={16} className="text-indigo-600" /> Internal Notes
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-4">
              {lead.notes?.map((note, idx) => (
                <div key={idx} className="group bg-slate-50 p-4 rounded-xl border border-transparent hover:border-indigo-100 transition-all relative">
                  {editingNoteIndex === idx ? (
                    <div className="space-y-2">
                      <textarea className="w-full bg-white p-2 rounded-lg text-sm outline-none border border-indigo-200" value={editNoteText} onChange={(e)=>setEditNoteText(e.target.value)} rows={2} />
                      <div className="flex justify-end gap-2">
                        <button onClick={()=>setEditingNoteIndex(null)} className="text-xs font-bold text-slate-400">Cancel</button>
                        <button onClick={handleSaveNoteEdit} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">Save</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-slate-700 leading-relaxed pr-10">{note}</p>
                      <div className="flex gap-1 absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>{setEditingNoteIndex(idx); setEditNoteText(note)}} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit3 size={14}/></button>
                        <button onClick={()=>handleDeleteNote(idx)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto relative shrink-0">
              <textarea 
                className="w-full bg-slate-50 p-4 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none outline-none"
                placeholder="Type a new note..."
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button 
                onClick={handleAddNote}
                disabled={isUpdating || !newNote.trim()}
                className="absolute right-3 bottom-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-lg"
              >
                Add Note
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}