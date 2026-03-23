"use client";

import { Plus, Trash2 } from "lucide-react";
import { Label, TextArea, Input, Button } from "@/app/components/ui";

export default function JobMainInfo({
  formData,
  handleChange,
  isFetchingContacts,
  setIsFetchingContacts,
}: any) {
  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...(formData.contacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    handleChange("contacts", newContacts);
  };

  const addContact = () =>
    handleChange("contacts", [...(formData.contacts || []), { name: "", role: "", email: "", linkedinUrl: "" }]);

  const removeContact = (index: number) => {
    const newContacts = [...(formData.contacts || [])];
    newContacts.splice(index, 1);
    handleChange("contacts", newContacts);
  };

  const autoFetchContacts = async () => {
    setIsFetchingContacts(true);
    try {
      const res = await fetch("/api/jobs/fetch-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: formData.companyName }),
      });
      const data = await res.json();
      if (data.success && data.contacts?.length > 0) {
        handleChange("contacts", [...(formData.contacts || []), ...data.contacts]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingContacts(false);
    }
  };

  return (
    <div className="flex-1 min-w-[280px] flex flex-col gap-[18px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <div>
          <Label>Job Position</Label>
          <Input
            value={formData.appliedJobPosition || ""}
            onChange={(e) => handleChange("appliedJobPosition", e.target.value)}
            placeholder="e.g. Senior Fullstack Engineer"
            className="text-[13px]"
          />
        </div>
        <div>
          <Label>Company Name</Label>
          <Input
            value={formData.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="e.g. Acme Corp"
            className="text-[13px]"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Company Email</Label>
          <Input
            value={formData.companyEmail || ""}
            onChange={(e) => handleChange("companyEmail", e.target.value)}
            placeholder="hr@company.com"
            className="text-[13px]"
          />
        </div>
      </div>

      <div>
        <Label>Job Description</Label>
        <TextArea
          rows={10}
          value={formData.jobDescription || ""}
          onChange={(e) => handleChange("jobDescription", e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      <div>
        <Label>Company Notes</Label>
        <TextArea
          rows={3}
          value={formData.companyDetails || ""}
          onChange={(e) => handleChange("companyDetails", e.target.value)}
          placeholder="Notes about the company..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <Label className="mb-0">Contacts</Label>
          <div className="flex gap-2">
            {formData.companyName && (
              <button
                type="button"
                onClick={autoFetchContacts}
                disabled={isFetchingContacts}
                className="text-[11px] text-blue-500 bg-transparent border-none cursor-pointer disabled:opacity-50 hover:text-blue-600 transition-colors"
              >
                {isFetchingContacts ? "Fetching…" : "Auto-fetch from LinkedIn"}
              </button>
            )}
            <Button variant="secondary"
              onClick={addContact}
              className="text-[11px] text-zinc-500 bg-transparent border-none cursor-pointer flex items-center gap-[3px] hover:text-zinc-700 transition-colors"
            >
              <Plus size={12} /> Add
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!formData.contacts || formData.contacts.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No contacts yet. Add hiring managers here.</p>
          ) : (
            formData.contacts.map((contact: any, idx: number) => (
              <div
                key={idx}
                className="bg-zinc-50 border border-zinc-200 rounded-[10px] p-3 relative"
              >
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  className="absolute top-2.5 right-2.5 bg-transparent border-none cursor-pointer text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
                <div className="grid grid-cols-2 gap-2 pr-5">
                  <Input
                    placeholder="Name"
                    value={contact.name || ""}
                    onChange={(e) => handleContactChange(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Role"
                    value={contact.role || ""}
                    onChange={(e) => handleContactChange(idx, "role", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    value={contact.email || ""}
                    onChange={(e) => handleContactChange(idx, "email", e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={contact.linkedinUrl || ""}
                    onChange={(e) => handleContactChange(idx, "linkedinUrl", e.target.value)}
                    className="col-span-2"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
