import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/app/utils/mongodb";
import Job from "@/app/models/Job";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    
    // Check if there is an email ID saved
    if (job.resendEmailId) {
      try {
        if (resend.emails.cancel) {
            await resend.emails.cancel(job.resendEmailId);
        } else {
            // Fallback for older Resend SDK versions or standard REST execution
            await fetch(`https://api.resend.com/emails/${job.resendEmailId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                }
            });
        }
      } catch(e: any) {
        console.log("Error cancelling strictly via Resend SDK", e.message);
      }
    }
    
    job.scheduledEmailDate = undefined;
    job.resendEmailId = undefined;
    await job.save();

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
