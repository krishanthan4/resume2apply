"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Building2, Globe, Trash2, UserPlus, ExternalLink, GripVertical, Linkedin, Users } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button, Input } from "@/app/components/ui";
import { toast } from "sonner";

export default function TargetCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/target-companies");
      const json = await res.json();
      if (json.success) {
        // Sort strictly by their order index, or fallback correctly
        const sorted = json.data.sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
        setCompanies(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/target-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCompanyName.trim(), order: companies.length }),
      });
      const json = await res.json();
      if (json.success) {
        setCompanies([...companies, json.data]); // insert at bottom visually
        setNewCompanyName("");
      }
    } catch (e) { console.error(e); }
    finally { setIsAdding(false); }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/target-companies/${id}`, { method: "DELETE" });
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (e) { console.error(e); }
  };

  const flushUpdate = async (id: string, updates: any) => {
    try {
      await fetch(`/api/target-companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (e) { console.error(e); }
  };

  const handleLocalChange = (id: string, field: string, value: string) => {
    setCompanies(companies.map((c) => (c._id === id ? { ...c, [field]: value } : c)));
  };

  const autoFetchConnections = async (id: string, companyName: string) => {
    const originalCompany = companies.find((c) => c._id === id);
    if (!originalCompany) return;
    toast.success(`Fetching LinkedIn profiles for ${companyName}…`);
    try {
      const res = await fetch("/api/jobs/fetch-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });
      const data = await res.json();
      if (data.success && data.contacts?.length > 0) {
        const mergedContacts = [...(originalCompany.contacts || []), ...data.contacts];
        setCompanies(companies.map((c) => (c._id === id ? { ...c, contacts: mergedContacts } : c)));
        flushUpdate(id, { contacts: mergedContacts });
        toast.success(`Found ${data.contacts.length} new connections!`);
      } else {
        toast.success("No additional connections found.");
      }
    } catch (e) { console.error(e); }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(companies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updated = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setCompanies(updated);

    try {
      await fetch("/api/target-companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: updated.map(c => ({ _id: c._id, order: c.order }))
        }),
      });
    } catch(err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-zinc-400">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3.5 mb-7">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.025em] text-zinc-900 mb-1">
            Step 3 — Target Companies
          </h1>
          <p className="text-sm text-zinc-500">
            Organise companies you want to work at and track your connections.
          </p>
        </div>

        <form onSubmit={addCompany} className="flex gap-2">
          <Input
            type="text"
            placeholder="Company name…"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="input-field w-[200px] text-[13px]"
          />
          <Button
            type="submit"
            disabled={isAdding || !newCompanyName.trim()}
            className="btn-primary text-[13px]"
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add
          </Button>
        </form>
      </div>

      {/* Target Companies List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="targets-list" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-4"
            >
              {companies.map((company, index) => (
                <Draggable key={company._id} draggableId={company._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white border border-zinc-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-6 relative ${
                        snapshot.isDragging ? "shadow-xl ring-1 ring-zinc-200 z-10" : ""
                      }`}
                    >
                      {/* Left: Main Details */}
                      <div className="flex-1 flex flex-col gap-4">
                        {/* Header + Drag Handle */}
                        <div className="flex items-start gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 cursor-grab text-zinc-400 hover:text-zinc-600"
                          >
                            <GripVertical size={18} />
                          </div>
                          <div className="w-10 h-10 rounded-[10px] bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                            <Building2 size={20} className="text-zinc-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="text-[16px] font-bold text-zinc-900 leading-tight block mb-1">
                                {company.name}
                              </div>
                              <button 
                                onClick={() => deleteCompany(company._id)}
                                className="text-zinc-300 hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              {/* Website */}
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Globe size={13} className="text-zinc-400" />
                                <Input
                                  type="text"
                                  placeholder="Website URL"
                                  value={company.website || ""}
                                  onChange={(e) => handleLocalChange(company._id, "website", e.target.value)}
                                  onBlur={() => flushUpdate(company._id, { website: company.website })}
                                  className="border-none outline-none bg-transparent p-0 w-32 focus:ring-0 placeholder:text-zinc-300"
                                />
                              </div>
                              {/* LinkedIn */}
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Linkedin size={13} className="text-zinc-400" />
                                <Input
                                  type="text"
                                  placeholder="LinkedIn URL"
                                  value={company.linkedinPageUrl || ""}
                                  onChange={(e) => handleLocalChange(company._id, "linkedinPageUrl", e.target.value)}
                                  onBlur={() => flushUpdate(company._id, { linkedinPageUrl: company.linkedinPageUrl })}
                                  className="border-none outline-none bg-transparent p-0 w-[140px] focus:ring-0 placeholder:text-zinc-300"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description & Why Apply */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pl-7 md:pl-0">
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                              Description / Notes
                            </label>
                            <textarea
                              value={company.description ?? company.notes ?? ""}
                              onChange={(e) => handleLocalChange(company._id, "description", e.target.value)}
                              onBlur={() => flushUpdate(company._id, { description: company.description })}
                              placeholder="What does the company do?"
                              className="w-full text-[13px] border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 outline-none text-zinc-700 min-h-[70px] resize-y focus:border-zinc-300 transition-colors placeholder:text-zinc-300"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                              Why apply?
                            </label>
                            <textarea
                              value={company.whyApply || ""}
                              onChange={(e) => handleLocalChange(company._id, "whyApply", e.target.value)}
                              onBlur={() => flushUpdate(company._id, { whyApply: company.whyApply })}
                              placeholder="Why are they a good fit?"
                              className="w-full text-[13px] border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 outline-none text-zinc-700 min-h-[70px] resize-y focus:border-zinc-300 transition-colors placeholder:text-zinc-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Connections */}
                      <div className="w-full md:w-[300px] flex flex-col pt-3 border-t border-zinc-100 md:border-t-0 md:border-l md:pl-6 md:pt-0 shrink-0">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.05em] flex items-center gap-1.5">
                            <Users size={14} /> 
                            Contacts ({company.contacts?.length || 0})
                          </span>
                          <Button variant="outline"
                            onClick={() => autoFetchConnections(company._id, company.name)}
                            className="text-[11px] text-zinc-600 bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <UserPlus size={12} /> Auto-find
                          </Button>
                        </div>
                        
                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                          {company.contacts?.map((contact: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200 rounded-lg p-2.5 group"
                            >
                              <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-zinc-900 truncate pr-2">{contact.name}</div>
                                <div className="text-[11px] text-zinc-500 truncate pr-2 mt-0.5">{contact.role}</div>
                              </div>
                              {contact.linkedinUrl && (
                                <a 
                                  href={contact.linkedinUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-zinc-400 hover:text-blue-500 transition-colors shrink-0 mt-0.5"
                                  title="View LinkedIn Profile"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          ))}
                          {(!company.contacts || company.contacts.length === 0) && (
                            <div className="text-[13px] text-zinc-400 italic bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-center border-dashed">
                              No connections found. Build your network to get a referral!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {companies.length === 0 && (
                <div className="py-16 text-center text-zinc-500 bg-zinc-50/50 rounded-[14px] border border-dashed border-zinc-200 text-sm">
                  Your target list is empty. Add a company to start organising!
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
