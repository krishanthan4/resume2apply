import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import Job from "@/app/models/Job";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { companyName, jobTitle, jobDescription, companyEmail, sourceUrl } = body;

    if (!companyName || !jobTitle) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Attempt to select the correct Cover letter template based on Job Title
    const clTemplates = await CoverLetterTemplate.find();
    let bestCoverLetterId = null;
    
    if (clTemplates.length > 0) {
      // Find one that matches job title loosely, or just pick first
      const match = clTemplates.find(t => t.name.toLowerCase().includes(jobTitle.toLowerCase()));
      bestCoverLetterId = match ? match._id : clTemplates[0]._id;
    }

    // Create the Job application in DB
    const newJob = await Job.create({
      companyName,
      appliedJobPosition: jobTitle,
      jobDescription: jobDescription || "",
      companyEmail: companyEmail || "",
      companyDetails: `Auto-Scraped Job from ${sourceUrl || 'LinkedIn / Job Portal'}`,
      status: "willing_to_apply",
      jobPostedDate: new Date(),
      coverLetterId: bestCoverLetterId,
    });

    const approveLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/jobs/${newJob._id}/approve-auto`;

    // Send a "Mobile Notification" via email to user's personal email (or webhook out to Zapier/Pushbullet etc)
    // Here we use the generic process.env.MY_EMAIL or hardcode to a notification
    
    // As a placeholder, we use RESEND to notify OURSELVES to approve it
    const myEmail = process.env.YOUR_EMAIL_ADDRESS || "kishanthan4@outlook.com"; // using context email

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `Agent <onboarding@resend.dev>`,
        to: [myEmail],
        subject: `[Action Required] Confirm Job Application for ${companyName}`,
        html: `
          <h3>Automated Job Finder</h3>
          <p>We found a matching job opening for you!</p>
          <ul>
            <li><strong>Company:</strong> ${companyName}</li>
            <li><strong>Role:</strong> ${jobTitle}</li>
            ${sourceUrl ? `<li><strong>Link:</strong> <a href="${sourceUrl}">View Job</a></li>` : ''}
          </ul>
          <p>We have pre-configured your CV and Cover Letter. Click below to approve and automatically send the application to ${companyEmail || 'HR (if found)'}.</p>
          <a href="${approveLink}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">Confirm & Apply</a>
        `
      });
    } else {
      console.log("Mock Notification Sent to Mobile/Email: PLEASE APPROVE BY CLICKING", approveLink);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Job scraped and pending approval.", 
      jobId: newJob._id 
    });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
