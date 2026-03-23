import dbConnect from "@/app/utils/mongodb";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import { defaultExecutiveSummaryTemplates, defaultCoverLetterTemplates } from "@/app/utils/defaultData";

export async function seedUserDefaultData(userId: string) {
    try {
        await dbConnect();

        // 1. Seed Executive Summary Templates
        const summaryCount = await ExecutiveSummaryTemplate.countDocuments({ userId });
        if (summaryCount === 0) {
            const summariesToCreate = defaultExecutiveSummaryTemplates.map(template => ({
                ...template,
                userId
            }));
            await ExecutiveSummaryTemplate.insertMany(summariesToCreate);
            console.log(`Seeded ${summariesToCreate.length} executive summaries for user ${userId}`);
        }

        // 2. Seed Cover Letter Templates
        const clCount = await CoverLetterTemplate.countDocuments({ userId });
        if (clCount === 0) {
            const clsToCreate = defaultCoverLetterTemplates.map(template => ({
                name: template.title, // Map 'title' to 'name' based on model
                subject: template.subject,
                body: template.body,
                userId
            }));
            await CoverLetterTemplate.insertMany(clsToCreate);
            console.log(`Seeded ${clsToCreate.length} cover letter templates for user ${userId}`);
        }

        return { success: true };
    } catch (error) {
        console.error(`Error seeding default data for user ${userId}:`, error);
        return { success: false, error };
    }
}
