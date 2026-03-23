import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import Job from "@/app/models/Job";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import { getEmailServiceForUser } from "@/app/utils/emailSending/EmailService";
import { getSession } from "@/app/lib/auth";
import User from "@/app/models/User";

function getNextWorkDayMorning8_58(currentDate: Date): Date {
  const date = new Date(currentDate);
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday

  if (day === 5) { // Friday
    date.setDate(date.getDate() + 3);
  } else if (day === 6) { // Saturday
    date.setDate(date.getDate() + 2);
  } else {
    date.setDate(date.getDate() + 1);
  }

  date.setHours(8, 58, 0, 0);
  return date;
}

function calculateScheduleTime(): Date {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  // Weekend
  if (day === 0 || day === 6) {
    return getNextWorkDayMorning8_58(now);
  }

  // Office hours logic
  if (hour < 8) {
    // Early morning before office, set to 8:58 AM same morning
    const scheduled = new Date(now);
    scheduled.setHours(8, 58, 0, 0);
    return scheduled;
  } else if (hour >= 8 && hour < 12) {
    // Current is Morning. "send it in the best time based on whether it is morning or evening"
    // Let's schedule it to 11:58 AM if we're still before that, or add 1 hour
    const scheduled = new Date(now);
    scheduled.setHours(11, 58, 0, 0);
    if (now > scheduled) {
      now.setMinutes(now.getMinutes() + 15); // if it's already 11:58+, send in 15 mins
      return now;
    }
    return scheduled;
  } else if (hour >= 12 && hour < 17) {
    // Current is Afternoon. Let's schedule to 15:58 (3:58 PM)
    const scheduled = new Date(now);
    scheduled.setHours(15, 58, 0, 0);
    if (now > scheduled) {
      now.setMinutes(now.getMinutes() + 15);
      return now;
    }
    return scheduled;
  } else {
    // After 17:00 (5 PM), schedule next morning 8:58 AM (skips weekends properly)
    return getNextWorkDayMorning8_58(now);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const { sendImmediately, coverLetterId, customScheduleTime } = body;

    const job = await Job.findOne({ _id: id, userId: session.userId });
    if (!job) return NextResponse.json({ success: false, error: "Job not found or access denied" }, { status: 404 });
    if (!job.companyEmail) return NextResponse.json({ success: false, error: "No company email on job" }, { status: 400 });

    let coverLetterSubject = `Application for ${job.appliedJobPosition}`;
    let coverLetterHtml = `<p>Hi,</p><p>I'm applying for the <b>${job.appliedJobPosition}</b> at ${job.companyName}.</p>`;

    if (coverLetterId) {
      const template = await CoverLetterTemplate.findOne({ _id: coverLetterId, userId: session.userId });
      if (template) {
        // Robust placeholder replacements for various keys
        coverLetterSubject = template.subject
          .replace(/\{\{company(?:Name)?\}\}/gi, job.companyName)
          .replace(/\{\{(?:job)?(?:T|t)itle\}\}/gi, job.appliedJobPosition)
          .replace(/\{\{position\}\}/gi, job.appliedJobPosition);

        let textBody = template.body
          .replace(/\{\{company(?:Name)?\}\}/gi, job.companyName)
          .replace(/\{\{(?:job)?(?:T|t)itle\}\}/gi, job.appliedJobPosition)
          .replace(/\{\{position\}\}/gi, job.appliedJobPosition);

        // Convert simple line breaks to HTML
        coverLetterHtml = textBody.replace(/\n/g, '<br/>');
      }
    }

    let scheduledTime: Date | null = null;
    let resendOptions: any = {
      from: process.env.EMAIL_FROM || "Portfolio Admin <onboarding@resend.dev>", // Uses EMAIL_FROM from .env.local
      to: [job.companyEmail],
      subject: coverLetterSubject,
      html: coverLetterHtml,
    };

    // Get user info for custom filename
    const user = await User.findById(session.userId);
    const userName = user?.name || "Candidate";

    // Attach CV dynamically
    // Call the internal resume API to generate PDF base64
    try {
      const proto = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host");

      let resumePdfRes;

      if (job.resumeData && job.resumeData.customData) {
        // We have a fully customized payload built from /custom-resume-design
        const resumeUrl = `${proto}://${host}/api/resume/preview`;

        let payload = { ...job.resumeData.customData };
        // If there's an explicit override in the kanban board (execSummaryId)
        if (job.execSummaryId) {
          // We need to fetch that template text to override the payload
          try {
            const ExecutiveSummaryTemplate = require("@/app/models/ExecutiveSummaryTemplate").default;
            const execData = await ExecutiveSummaryTemplate.findOne({ _id: job.execSummaryId, userId: session.userId }).lean();
            if (execData && (execData.detailedSummary || execData.shortSummary)) {
              payload.selectedExecutiveSummaryText = execData.detailedSummary || execData.shortSummary;
            }
          } catch (e) { }
        }

        resumePdfRes = await fetch(resumeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

      } else {
        // Fallback to the standard GET generating a default CV
        let resumeUrl = `${proto}://${host}/api/resume?type=detailed`;
        if (job.execSummaryId) {
          resumeUrl += `&execSummaryId=${job.execSummaryId}`;
        }
        // Note: For internal fetch, we might need to pass session cookie if needed, 
        // but here it's likely just a public-ish generator or needs bearer.
        const cookie = request.headers.get("cookie");
        resumePdfRes = await fetch(resumeUrl, {
          headers: cookie ? { "Cookie": cookie } : {}
        });
      }

      if (resumePdfRes.ok) {
        const arrayBuffer = await resumePdfRes.arrayBuffer();
        const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

        // Use custom filename if provided, otherwise standard format
        let customName = body.resumeFileName || job.resumeFileName;
        let finalFileName;

        if (customName && customName.trim()) {
          finalFileName = customName.trim().replace(/\s+/g, '_');
          if (!finalFileName.toLowerCase().endsWith('.pdf')) {
            finalFileName += '.pdf';
          }
        } else {
          finalFileName = `${userName.replace(/\s+/g, '_')}__${job.companyName.replace(/\s+/g, '_')}__resume.pdf`;
        }

        resendOptions.attachments = [
          {
            filename: finalFileName,
            content: base64Pdf,
          },
        ];
      } else {
        console.error("Failed PDF generation status: ", resumePdfRes.status);
      }
    } catch (e) {
      console.log("Failed to fetch/attach CV PDF:", e);
    }


    if (!sendImmediately) {
      if (customScheduleTime) {
        scheduledTime = new Date(customScheduleTime);
        resendOptions.scheduled_at = scheduledTime.toISOString();
      } else {
        scheduledTime = calculateScheduleTime();
        // Resend allows scheduling up to 72 hours.
        // E.g. Friday 6pm scheduling for Monday 9am is max ~63 hours, perfectly fitting within 72 hrs.
        resendOptions.scheduled_at = scheduledTime.toISOString();
      }
    }

    // DECISION: Should we send now or queue for later?
    // Resend (native cloud provider) handles its own scheduling.
    // Gmail/Outlook (personal OAuth) needs our server to manage the "When".
    const isOAuthProvider = user?.emailConnection?.provider === "gmail" || user?.emailConnection?.provider === "outlook";

    if (!sendImmediately && isOAuthProvider) {
      // QUEUE ONLY - Don't call emailService.sendEmail yet
      job.scheduledEmailDate = scheduledTime || calculateScheduleTime();
      job.scheduleStatus = "pending";
      // We might want to store the computed subject/html in the job if needed, 
      // but for now the cron worker can re-calculate or we can add fields.
      // Let's stick to updating the status.
      await job.save();

      return NextResponse.json({
        success: true,
        message: "Email queued for scheduled delivery",
        scheduledTime: job.scheduledEmailDate,
        data: job
      });
    }

    const emailService = await getEmailServiceForUser(session.userId);

    const emailResponse = await emailService.sendEmail(
      job.companyEmail,
      coverLetterSubject,
      coverLetterHtml,
      resendOptions.attachments,
      resendOptions.scheduled_at
    );



    if (!emailResponse.success || emailResponse.error) {
      return NextResponse.json({ success: false, error: emailResponse.error?.message || "Failed to send email" }, { status: 400 });
    }

    // Save Resend Email ID if it was scheduled
    if (!sendImmediately && emailResponse.data?.id) {
      job.resendEmailId = emailResponse.data.id;
    }

    // Update job status
    job.scheduledEmailDate = scheduledTime || new Date();
    // Move slightly into tracking. Maybe stay applied if done.
    if (job.status === "willing_to_apply") {
      job.status = "applied";
    }
    await job.save();

    return NextResponse.json({
      success: true,
      scheduledTime: job.scheduledEmailDate,
      data: job
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


