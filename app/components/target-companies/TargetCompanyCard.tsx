"use client";

import React, { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button, Input, ConfirmationModal } from "@/app/components/ui";
import { Trash2, Globe, Linkedin, Users, UserPlus, ExternalLink, GripVertical, Building2, Pencil, Check, X, Plus } from "lucide-react";

interface TargetCompanyCardProps {
  company: any;
  index: number;
  deleteCompany: (id: string) => void;
  handleLocalChange: (id: string, field: string, value: string) => void;
  flushUpdate: (id: string, updates: any) => void;
  autoFetchConnections: (id: string, companyName: string, linkedinPageUrl?: string) => void;
  isDragDisabled?: boolean;
  viewMode: "detailed" | "short";
}

export function TargetCompanyCard({
  company,
  index,
  deleteCompany,
  handleLocalChange,
  flushUpdate,
  autoFetchConnections,
  isDragDisabled,
  viewMode,
}: TargetCompanyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: company.name || "",
    website: company.website || "",
    linkedinPageUrl: company.linkedinPageUrl || "",
    description: company.description ?? company.notes ?? "",
    whyApply: company.whyApply || "",
  });
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", linkedinUrl: "" });
  const [deleteContactIdx, setDeleteContactIdx] = useState<number | null>(null);
  const [deleteContactModalOpen, setDeleteContactModalOpen] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLogo = async () => {
      // If no valid URL string, keep null
      if (!company.website && !company.linkedinPageUrl) {
        setLogoUrl(null);
        return;
      }
      try {
        const res = await fetch("/api/target-companies/logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            linkedinPageUrl: company.linkedinPageUrl,
            website: company.website,
          }),
        });
        const data = await res.json();
        if (active && data.success && data.logoUrl) {
          setLogoUrl(data.logoUrl);
          setLogoError(false);
        }
      } catch (e) {
        console.error("Logo fetch error", e);
      }
    };
    fetchLogo();
    return () => {
      active = false;
    };
  }, [company.website, company.linkedinPageUrl]);

  useEffect(() => {
    setDraft({
      name: company.name || "",
      website: company.website || "",
      linkedinPageUrl: company.linkedinPageUrl || "",
      description: company.description ?? company.notes ?? "",
      whyApply: company.whyApply || "",
    });
  }, [company]);

  const handleUpdate = () => {
    // Save to backend
    flushUpdate(company._id, draft);
    // Update parent state so UI persists
    Object.entries(draft).forEach(([key, value]) => {
      handleLocalChange(company._id, key, value as string);
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert draft
    setDraft({
      name: company.name || "",
      website: company.website || "",
      linkedinPageUrl: company.linkedinPageUrl || "",
      description: company.description ?? company.notes ?? "",
      whyApply: company.whyApply || "",
    });
    setIsEditing(false);
  };

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    
    const updatedContacts = [...(company.contacts || []), newContact];
    
    flushUpdate(company._id, { contacts: updatedContacts });
    // This updates the local list by manipulating parent state
    // but the parent might only support specific fields, let's manually override handling here:
    handleLocalChange(company._id, "contacts", updatedContacts as any);
    
    setNewContact({ name: "", role: "", linkedinUrl: "" });
    setIsAddingContact(false);
  };

  const handleDeleteContact = (indexToRemove: number) => {
    setDeleteContactIdx(indexToRemove);
    setDeleteContactModalOpen(true);
  };

  const confirmDeleteContact = () => {
    if (deleteContactIdx === null) return;
    const updatedContacts = (company.contacts || []).filter((_: any, i: number) => i !== deleteContactIdx);
    flushUpdate(company._id, { contacts: updatedContacts });
    handleLocalChange(company._id, "contacts", updatedContacts as any);
    setDeleteContactModalOpen(false);
    setDeleteContactIdx(null);
  };

  return (
    <Draggable key={company._id} draggableId={company._id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white border border-zinc-200 rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] relative group overflow-hidden ${
            snapshot.isDragging ? "shadow-xl ring-1 ring-zinc-200 z-10" : ""
          } ${viewMode === "short" ? "flex items-center gap-3 p-4 hover:bg-zinc-50 transition-colors" : "flex flex-col md:flex-row gap-6 p-5"}`}
        >
          {viewMode === "short" ? (
            <>
              <div
                {...provided.dragHandleProps}
                className="cursor-grab text-zinc-400 hover:text-zinc-600 z-10 relative"
              >
                <GripVertical size={18} />
              </div>
              <div className="w-8 h-8 rounded-[8px] bg-white border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden z-10 relative">
                {logoUrl && !logoError ? (
                  <img src={logoUrl} alt={company.name} onError={() => setLogoError(true)} className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={16} className="text-zinc-600" />
                )}
              </div>
              {company.linkedinPageUrl?.trim() ? (
                <a
                  href={company.linkedinPageUrl.startsWith('http') ? company.linkedinPageUrl : `https://${company.linkedinPageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-semibold text-[14px] text-zinc-900 truncate z-10 relative hover:underline hover:text-blue-800"
                  title="View LinkedIn Page"
                >
                  {company.name}
                </a>
              ) : company.website?.trim() ? (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-semibold text-[14px] text-zinc-900 truncate z-10 relative hover:underline hover:text-blue-800"
                  title="View Website"
                >
                  {company.name}
                </a>
              ) : (
                <div className="flex-1 font-semibold text-[14px] text-zinc-900 truncate z-10 relative">
                  {company.name}
                </div>
              )}
            </>
          ) : (
            <>
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
              <div className="w-10 h-10 rounded-[10px] bg-white border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                {logoUrl && !logoError ? (
                  <img src={logoUrl} alt={company.name} onError={() => setLogoError(true)} className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={20} className="text-zinc-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="text-[16px] font-bold text-zinc-900 leading-tight mb-1 p-1 h-8 bg-zinc-50 border-zinc-200 w-full"
                        placeholder="Company Name"
                      />
                    ) : (
                      <div className="text-[16px] font-bold text-zinc-900 leading-tight block mb-1">
                        {company.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                        <Button
                          onClick={handleUpdate}
                          className="h-7 px-2.5 text-xs bg-zinc-900 text-white rounded-md flex items-center gap-1.5"
                        >
                          <Check size={14} /> Update
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-zinc-400 hover:text-blue-500 transition-colors p-1"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteCompany(company._id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col sm:items-center gap-3 mt-1">
                  {/* Website */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 min-h-[24px]">
                    <Globe size={13} className="text-zinc-400 shrink-0" />
                    {isEditing ? (
                      <Input
                        type="text"
                        placeholder="Website URL"
                        value={draft.website}
                        onChange={(e) => setDraft({ ...draft, website: e.target.value })}
                        className="h-6 text-xs p-1 bg-zinc-50 border-zinc-200 w-40"
                      />
                    ) : (
                      <span className={company.website ? "text-blue-600 hover:underline" : "text-zinc-400 italic"}>
                        {company.website ? (
                          <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                            {company.website}
                          </a>
                        ) : "No website"}
                      </span>
                    )}
                  </div>
                  {/* LinkedIn */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 min-h-[24px]">
                    <Linkedin size={13} className="text-zinc-400 shrink-0" />
                    {isEditing ? (
                      <Input
                        type="text"
                        placeholder="LinkedIn URL"
                        value={draft.linkedinPageUrl}
                        onChange={(e) => setDraft({ ...draft, linkedinPageUrl: e.target.value })}
                        className="h-6 text-xs p-1 bg-zinc-50 border-zinc-200 w-40"
                      />
                    ) : (
                      <span className={company.linkedinPageUrl ? "text-blue-600 hover:underline" : "text-zinc-400 italic"}>
                        {company.linkedinPageUrl ? (
                          <a href={company.linkedinPageUrl.startsWith('http') ? company.linkedinPageUrl : `https://${company.linkedinPageUrl}`} target="_blank" rel="noopener noreferrer">
                            LinkedIn Page
                          </a>
                        ) : "No LinkedIn value"}
                      </span>
                    )}
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
                {isEditing ? (
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="What does the company do?"
                    className="w-full text-[13px] border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 outline-none text-zinc-700 min-h-[70px] resize-y focus:border-zinc-300 transition-colors placeholder:text-zinc-300"
                  />
                ) : (
                  <div className="text-[13px] text-zinc-700 bg-zinc-50/50 border border-transparent rounded-lg p-2.5 min-h-[70px] whitespace-pre-wrap">
                    {company.description ?? company.notes ? (
                      company.description ?? company.notes
                    ) : (
                      <span className="text-zinc-400 italic">No notes added.</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                  Why apply?
                </label>
                {isEditing ? (
                  <textarea
                    value={draft.whyApply}
                    onChange={(e) => setDraft({ ...draft, whyApply: e.target.value })}
                    placeholder="Why are they a good fit?"
                    className="w-full text-[13px] border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 outline-none text-zinc-700 min-h-[70px] resize-y focus:border-zinc-300 transition-colors placeholder:text-zinc-300"
                  />
                ) : (
                  <div className="text-[13px] text-zinc-700 bg-zinc-50/50 border border-transparent rounded-lg p-2.5 min-h-[70px] whitespace-pre-wrap">
                    {company.whyApply ? (
                      company.whyApply
                    ) : (
                      <span className="text-zinc-400 italic">No reason specified.</span>
                    )}
                  </div>
                )}
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
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="text-[11px] text-zinc-600 bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1 hover:bg-zinc-200 transition-colors flex items-center gap-1 font-medium"
                  title="Add Contact Manually"
                >
                  <Plus size={12} /> Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => autoFetchConnections(company._id, company.name, company.linkedinPageUrl)}
                  className="text-[11px] text-zinc-600 bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1 hover:bg-zinc-200 transition-colors flex items-center gap-1 font-medium"
                >
                  <UserPlus size={12} /> Auto
                </Button>
              </div>
            </div>

            {isAddingContact && (
              <div className="mb-3 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="text-xs h-7 p-1.5 bg-white"
                />
                <Input
                  type="text"
                  placeholder="Role"
                  value={newContact.role}
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  className="text-xs h-7 p-1.5 bg-white"
                />
                <Input
                  type="text"
                  placeholder="LinkedIn URL (Optional)"
                  value={newContact.linkedinUrl}
                  onChange={(e) => setNewContact({ ...newContact, linkedinUrl: e.target.value })}
                  className="text-xs h-7 p-1.5 bg-white"
                />
                <div className="flex justify-end gap-1.5 mt-1">
                  <button
                    onClick={() => setIsAddingContact(false)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-700 px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    className="text-[11px] bg-zinc-900 text-white rounded px-2.5 py-1 font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {company.contacts?.map((contact: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200 rounded-lg p-2.5 group relative"
                >
                  <div className="min-w-0 pr-6">
                    <div className="text-[13px] font-semibold text-zinc-900 truncate">{contact.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate mt-0.5">{contact.role}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 absolute right-2.5 top-2.5">
                    {contact.linkedinUrl && (
                      <a
                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-blue-500 transition-colors shrink-0 bg-white/50 p-1 rounded-sm"
                        title="View LinkedIn Profile"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteContact(idx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors shrink-0 bg-white/50 p-1 rounded-sm opacity-0 group-hover:opacity-100"
                      title="Delete Contact"
                    >
                      <X size={14} />
                    </button>
                              {/* Contact Delete Confirmation Modal */}
                              <ConfirmationModal
                                isOpen={deleteContactModalOpen}
                                onClose={() => setDeleteContactModalOpen(false)}
                                onConfirm={confirmDeleteContact}
                                title="Delete Contact"
                                message="Are you sure you want to delete this contact? This action cannot be undone."
                                confirmText="Delete"
                                isDestructive={true}
                              />
                  </div>
                </div>
              ))}
              {(!company.contacts || company.contacts.length === 0) && (
                <div className="text-[13px] text-zinc-400 italic bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-center border-dashed">
                  No connections found. Build your network to get a referral!
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
