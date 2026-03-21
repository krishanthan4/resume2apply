import mongoose from "mongoose";

const TargetCompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    notes: { type: String },
    linkedinPageUrl: { type: String },
    website: { type: String },
    description: { type: String },
    whyApply: { type: String },
    order: { type: Number, default: 0 },
    contacts: [
      {
        name: { type: String },
        role: { type: String },
        linkedinUrl: { type: String },
        email: { type: String },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TargetCompany || mongoose.model("TargetCompany", TargetCompanySchema);
