import mongoose from "mongoose";

const ExecutiveSummaryTemplateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    shortSummary: { type: String }, // The actual summary paragraph
    detailedSummary: { type: String, required: true }, // The actual summary paragraph
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.ExecutiveSummaryTemplate || mongoose.model("ExecutiveSummaryTemplate", ExecutiveSummaryTemplateSchema);
