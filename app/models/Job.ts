import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  linkedinUrl: { type: String },
  email: { type: String },
});

const JobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    companyName: { type: String, required: true },
    companyEmail: { type: String },
    appliedJobPosition: { type: String, required: true },
    status: {
      type: String,
      enum: ["willing_to_apply", "applied", "in_progress", "rejected"],
      default: "willing_to_apply",
    },
    appliedDate: { type: Date },
    jobPostedDate: { type: Date },
    jobDescription: { type: String },
    companyDetails: { type: String },
    contacts: [ContactSchema],
    resumeData: {
      templateName: { type: String }, // e.g. "executive summary template + resume template name"
      customData: { type: mongoose.Schema.Types.Mixed }, // Differences in data (project priority, skills, summary)
    },
    coverLetterId: { type: mongoose.Schema.Types.ObjectId, ref: "CoverLetterTemplate" },
    execSummaryId: { type: String },
    scheduledEmailDate: { type: Date }, // For tracking scheduled times
    scheduleStatus: { type: String, enum: ["pending", "sent", "cancelled"] },
    resendEmailId: { type: String }, // Stores the Resend API ID for cancellation
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
