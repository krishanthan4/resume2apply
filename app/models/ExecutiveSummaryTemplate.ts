import mongoose from "mongoose";

const ExecutiveSummaryTemplateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true }, // The actual summary paragraph
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ExecutiveSummaryTemplate || mongoose.model("ExecutiveSummaryTemplate", ExecutiveSummaryTemplateSchema);
