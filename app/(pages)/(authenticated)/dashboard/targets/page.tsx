"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Building2, Globe, Trash2, UserPlus, ExternalLink } from "lucide-react";

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
      if (json.success) setCompanies(json.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const addCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/target-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCompanyName.trim() }),
      });
      const json = await res.json();
      if (json.success) { setCompanies([json.data, ...companies]); setNewCompanyName(""); }
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
    alert(`Fetching LinkedIn profiles for ${companyName}…`);
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
        alert(`Found ${data.contacts.length} new connections!`);
      } else {
        alert("No additional connections found.");
      }
    } catch (e) { console.error(e); }
  };

  if (isLoading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", color: "#18181b", marginBottom: 4 }}>
            Step 3 — Target Companies
          </h1>
          <p style={{ fontSize: 14, color: "#71717a" }}>
            Organise companies you want to work at and track your connections.
          </p>
        </div>

        <form onSubmit={addCompany} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Company name…"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="input-field"
            style={{ width: 200, fontSize: 13 }}
          />
          <button
            type="submit"
            disabled={isAdding || !newCompanyName.trim()}
            className="btn-primary"
            style={{ fontSize: 13 }}
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add
          </button>
        </form>
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {companies.map((company) => (
          <div
            key={company._id}
            style={{
              background: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: 14,
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Company header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#f4f4f5",
                    border: "1px solid #e4e4e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={18} color="#52525b" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>{company.name}</div>
                  <input
                    type="text"
                    placeholder="Industry"
                    value={company.industry || ""}
                    onChange={(e) => handleLocalChange(company._id, "industry", e.target.value)}
                    onBlur={() => flushUpdate(company._id, { industry: company.industry })}
                    style={{ fontSize: 11, color: "#71717a", border: "none", outline: "none", background: "transparent", padding: 0, width: 120 }}
                  />
                </div>
              </div>
              <button onClick={() => deleteCompany(company._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d4d4d8", padding: 4 }}>
                <Trash2 size={14} />
              </button>
            </div>

            {/* Website */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={12} color="#a1a1aa" />
              <input
                type="text"
                placeholder="Website URL"
                value={company.website || ""}
                onChange={(e) => handleLocalChange(company._id, "website", e.target.value)}
                onBlur={() => flushUpdate(company._id, { website: company.website })}
                style={{ fontSize: 12, color: "#71717a", border: "none", outline: "none", background: "transparent", padding: 0, flex: 1 }}
              />
            </div>

            {/* Connections */}
            <div style={{ borderTop: "1px solid #f4f4f5", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Connections ({company.contacts?.length || 0})
                </span>
                <button
                  onClick={() => autoFetchConnections(company._id, company.name)}
                  style={{ fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <UserPlus size={12} /> Find
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 120, overflowY: "auto" }}>
                {company.contacts?.map((contact: any, idx: number) => (
                  <div
                    key={idx}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8, padding: "7px 10px" }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#18181b" }}>{contact.name}</div>
                      <div style={{ fontSize: 11, color: "#71717a" }}>{contact.role}</div>
                    </div>
                    {contact.linkedinUrl && (
                      <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", display: "flex" }}>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
                {(!company.contacts || company.contacts.length === 0) && (
                  <p style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>No connections yet.</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <textarea
              value={company.notes || ""}
              onChange={(e) => handleLocalChange(company._id, "notes", e.target.value)}
              onBlur={() => flushUpdate(company._id, { notes: company.notes })}
              placeholder="Notes about this company…"
              className="textarea-field"
              style={{ minHeight: 64, fontSize: 12, resize: "vertical" }}
            />
          </div>
        ))}
        {companies.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "64px 0",
              textAlign: "center",
              color: "#a1a1aa",
              fontSize: 14,
            }}
          >
            No target companies yet. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
