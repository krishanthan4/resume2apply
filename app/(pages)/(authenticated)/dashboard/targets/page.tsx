"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TargetCompaniesHeader } from "@/app/components/target-companies/TargetCompaniesHeader";
import { TargetCompaniesList } from "@/app/components/target-companies/TargetCompaniesList";
import { ConfirmationModal } from "@/app/components/ui/ConfirmationModal";

export default function TargetCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"detailed" | "short">("detailed");

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

  const initiateDelete = (id: string) => {
    setCompanyToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      await fetch(`/api/target-companies/${companyToDelete}`, { method: "DELETE" });
      setCompanies((prev) => prev.filter((c) => c._id !== companyToDelete));
      toast.success("Target company deleted");
    } catch (e) { 
      console.error(e); 
      toast.error("Failed to delete company");
    } finally {
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    }
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
    setCompanies((prev) => prev.map((c) => (c._id === id ? { ...c, [field]: value } : c)));
  };

  const autoFetchConnections = async (id: string, companyName: string, linkedinPageUrl?: string) => {
    const originalCompany = companies.find((c) => c._id === id);
    if (!originalCompany) return;
    toast.success(`Fetching LinkedIn profiles for ${companyName}…`);
    try {
      const res = await fetch("/api/jobs/fetch-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, linkedinPageUrl }),
      });
      const data = await res.json();
      if (data.success && data.contacts?.length > 0) {
        const mergedContacts = [...(originalCompany.contacts || []), ...data.contacts];
        setCompanies((prev) => prev.map((c) => (c._id === id ? { ...c, contacts: mergedContacts } : c)));
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

  const isSearchActive = searchQuery.trim().length > 0;
  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      (company.name && company.name.toLowerCase().includes(query)) ||
      (company.description && company.description.toLowerCase().includes(query)) ||
      (company.notes && company.notes.toLowerCase().includes(query)) ||
      (company.whyApply && company.whyApply.toLowerCase().includes(query)) ||
      (company.contacts && company.contacts.some((c: any) => 
        (c.name && c.name.toLowerCase().includes(query)) || 
        (c.role && c.role.toLowerCase().includes(query))
      ))
    );
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-zinc-400">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <TargetCompaniesHeader
        newCompanyName={newCompanyName}
        setNewCompanyName={setNewCompanyName}
        isAdding={isAdding}
        addCompany={addCompany}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <TargetCompaniesList
        companies={filteredCompanies}
        isSearchActive={isSearchActive}
        viewMode={viewMode}
        onDragEnd={onDragEnd}
        deleteCompany={initiateDelete}
        handleLocalChange={handleLocalChange}
        flushUpdate={flushUpdate}
        autoFetchConnections={autoFetchConnections}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Target Company"
        message="Are you sure you want to delete this target company? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
