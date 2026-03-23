import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import Job from "@/app/models/Job";
import User from "@/app/models/User";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import { getEmailServiceForUser } from "@/app/utils/emailSending/EmailService";

/**
 * CRON WORKER: Process scheduled emails for OAuth accounts (Gmail/Outlook).
 * Resend natively handles its own cloud scheduling.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");

        // Simple security check (Configure CRON_SECRET in .env.local)
        if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Find jobs that are due for delivery
        // We look for 'pending' status and a scheduled time in the past or now
        const now = new Date();
        const pendingJobs = await Job.find({
            scheduleStatus: "pending",
            scheduledEmailDate: { $lte: now }
        }).limit(10); // Process 10 at a time to avoid timeout/spam detection

        const results = [];

        for (const job of pendingJobs) {
            try {
                const user = await User.findById(job.userId);
                if (!user || user.emailConnection?.provider === "none") {
                    job.scheduleStatus = "cancelled";
                    await job.save();
                    results.push({ jobId: job._id, status: "cancelled_user_disconnected" });
                    continue;
                }

                // Prepare Content
                let coverLetterSubject = `Application for ${job.appliedJobPosition}`;
                let coverLetterHtml = `<p>Hi,</p><p>I'm applying for the <b>${job.appliedJobPosition}</b> at ${job.companyName}.</p>`;

                if (job.coverLetterId) {
                    const template = await CoverLetterTemplate.findOne({ _id: job.coverLetterId, userId: job.userId });
                    if (template) {
                        coverLetterSubject = template.subject
                            .replace(/\{\{company(?:Name)?\}\}/gi, job.companyName)
                            .replace(/\{\{(?:job)?(?:T|t)itle\}\}/gi, job.appliedJobPosition)
                            .replace(/\{\{position\}\}/gi, job.appliedJobPosition);

                        let textBody = template.body
                            .replace(/\{\{company(?:Name)?\}\}/gi, job.companyName)
                            .replace(/\{\{(?:job)?(?:T|t)itle\}\}/gi, job.appliedJobPosition)
                            .replace(/\{\{position\}\}/gi, job.appliedJobPosition);

                        coverLetterHtml = textBody.replace(/\n/g, '<br/>');
                    }
                }

                // Prepare Attachments (Dynamic PDF Generation)
                // We need to fetch the resume PDF. Since this is a server-side route, 
                // we call the internal resume API using the protocol/host.
                let attachments: any[] = [];
                try {
                    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
                    const host = process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1] || "localhost:3000";

                    let resumeUrl;
                    let payload: any = null;

                    if (job.resumeData && job.resumeData.customData) {
                        resumeUrl = `${proto}://${host}/api/resume/preview`;
                        payload = { ...job.resumeData.customData };

                        if (job.execSummaryId) {
                            try {
                                const ExecutiveSummaryTemplate = require("@/app/models/ExecutiveSummaryTemplate").default;
                                const execData = await ExecutiveSummaryTemplate.findOne({ _id: job.execSummaryId, userId: job.userId }).lean();
                                if (execData && (execData.detailedSummary || execData.shortSummary)) {
                                    payload.selectedExecutiveSummaryText = execData.detailedSummary || execData.shortSummary;
                                }
                            } catch (e) { }
                        }
                    } else {
                        resumeUrl = `${proto}://${host}/api/resume?type=detailed&userId=${job.userId}`;
                        if (job.execSummaryId) resumeUrl += `&execSummaryId=${job.execSummaryId}`;
                    }

                    const resumePdfRes = await fetch(resumeUrl, {
                        method: payload ? "POST" : "GET",
                        headers: { "Content-Type": "application/json" },
                        body: payload ? JSON.stringify(payload) : null,
                    });

                    if (resumePdfRes.ok) {
                        const arrayBuffer = await resumePdfRes.arrayBuffer();
                        const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

                        const userName = user.name || "Candidate";
                        const customName = job.resumeFileName;
                        let finalFileName;

                        if (customName && customName.trim()) {
                            finalFileName = customName.trim().replace(/\s+/g, '_');
                            if (!finalFileName.toLowerCase().endsWith('.pdf')) finalFileName += '.pdf';
                        } else {
                            finalFileName = `${userName.replace(/\s+/g, '_')}__${job.companyName.replace(/\s+/g, '_')}__resume.pdf`;
                        }

                        attachments = [{ filename: finalFileName, content: base64Pdf }];
                    }
                } catch (pdfErr) {
                    console.error(`PDF generation failed for job ${job._id}:`, pdfErr);
                }

                // Send Email
                const emailService = await getEmailServiceForUser(job.userId.toString());
                const res = await emailService.sendEmail(
                    job.companyEmail,
                    coverLetterSubject,
                    coverLetterHtml,
                    attachments
                );

                if (res.success) {
                    job.scheduleStatus = "sent";
                    if (job.status === "willing_to_apply") job.status = "applied";
                    await job.save();
                    results.push({ jobId: job._id, status: "sent" });
                } else {
                    console.error(`Worker fail for job ${job._id}:`, res.error);
                    results.push({ jobId: job._id, status: "failed", error: res.error });
                }

                // Human-like delay (jitter) between emails in the same chunk
                await new Promise(resolve => setTimeout(resolve, 5000));

            } catch (jobError: any) {
                console.error(`Error processing job ${job._id}:`, jobError);
                results.push({ jobId: job._id, status: "error", error: jobError.message });
            }
        }

        return NextResponse.json({
            success: true,
            processed: pendingJobs.length,
            details: results
        });

    } catch (error: any) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
