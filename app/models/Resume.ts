import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: String,
  jobRole: String,
  startDate: String,
  endDate: String,
  currentlyWorking: Boolean,
  bulletPoints: [String],
});

const ProjectSchema = new mongoose.Schema({
  projectName: String,
  githubLink: String,
  liveLink: String,
  techStack: [String],
  bulletPoints: [String],
});

const EducationSchema = new mongoose.Schema({
  degreeName: String,
  universityName: String,
  location: String,
  graduatedDate: String,
  enableDate: Boolean,
});

const SkillCategorySchema = new mongoose.Schema({
  category: String,
  skills: [String],
});

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    titleDetails: {
      name: String,
      email: String,
      githubLink: String,
      linkedinLink: String,
      portfolioLink: String,
      country: String,
    },
    experiences: [ExperienceSchema],
    projects: [ProjectSchema],
    skills: [SkillCategorySchema],
    education: EducationSchema,
    executiveSummary: String,
    theme: { type: String, default: 'default' },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
