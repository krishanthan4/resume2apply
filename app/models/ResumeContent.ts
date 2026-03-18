import mongoose from 'mongoose';

const PersonalDetailsSchema = new mongoose.Schema({
    name: String,
    phone: {
        number: String,
    },
    email: String,
    personalWebsite: String,
    github: String,
    linkedin: String,
    location: String,
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    achievements: [String],
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: [String],
    techStack: String,
    githubUrl: String,
    liveUrl: String,
});

const SkillCategorySchema = new mongoose.Schema({
    category: String,
    skills: [String],
});

const EducationSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    location: String,
    endDate: String,
});

const ResumeContentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        personalDetails: PersonalDetailsSchema,
        experiences: [ExperienceSchema],
        projects: [ProjectSchema],
        skillsData: [SkillCategorySchema],
        customSkillBullet1: String,
        customSkillBullet2: String,
        educations: [EducationSchema],
    },
    { timestamps: true }
);

export default mongoose.models.ResumeContent || mongoose.model('ResumeContent', ResumeContentSchema);
