import mongoose from "mongoose";

const CoverLetterTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true }, // Store markdown or text with variables like {{company}}
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CoverLetterTemplate || mongoose.model("CoverLetterTemplate", CoverLetterTemplateSchema);
