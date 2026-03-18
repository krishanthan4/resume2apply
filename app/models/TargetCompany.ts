import mongoose from "mongoose";

const TargetCompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    website: { type: String },
    notes: { type: String },
    contacts: [
      {
        name: { type: String },
        role: { type: String },
        linkedinUrl: { type: String },
        portfolioUrl: { type: String },
        email: { type: String },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TargetCompany || mongoose.model("TargetCompany", TargetCompanySchema);
