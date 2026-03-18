import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import Job from "@/app/models/Job";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    // If company email does not exist, redirect to board to fill it manually
    if (!job.companyEmail) {
      // Assuming a generic pattern in the frontend, we can't fully auto-apply without an email.
      // Redirect to Kanban to fill it manually
      const url = new URL(`/job-apply?openJob=${id}&error=missing_email`, request.url);
      return NextResponse.redirect(url);
    }

    // We have the email! Call the internal send-email endpoint.
    // However, since we are inside standard NextJS API, we can just do a fetch internally or reuse logic.
    // Fetching absolute URL:
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    
    const sendRes = await fetch(`${baseUrl}/api/jobs/${id}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sendImmediately: true,
        coverLetterId: job.coverLetterId
      })
    });

    const result = await sendRes.json();
    
    if (result.success) {
      job.status = "applied";
      await job.save();
      
      return new NextResponse(`
        <html>
          <body style="font-family:sans-serif; background:#09090b; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh;">
            <div style="text-align:center; padding:2rem; border:1px solid #333; border-radius:12px; background:#18181b;">
              <h1 style="color:#22c55e;">Application Sent Successfully! 🎉</h1>
              <p>Your tailored CV and Cover Letter were sent to ${job.companyEmail} for the ${job.appliedJobPosition} role at ${job.companyName}.</p>
              <a href="/job-apply" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#fafafa; color:#000; text-decoration:none; border-radius:5px; font-weight:bold;">Go to Dashboard</a>
            </div>
          </body>
        </html>
      `, { headers: { "Content-Type": "text/html" } });
    } else {
       return new NextResponse(`
        <html>
          <body style="font-family:sans-serif; background:#09090b; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh;">
            <div style="text-align:center; padding:2rem; border:1px solid #333; border-radius:12px; background:#18181b;">
              <h1 style="color:#ef4444;">Failed to Auto-Apply ❌</h1>
              <p>Reason: ${result.error || "Unknown error"}. Check dashboard for details.</p>
              <a href="/job-apply" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#fafafa; color:#000; text-decoration:none; border-radius:5px; font-weight:bold;">Go to Dashboard</a>
            </div>
          </body>
        </html>
      `, { headers: { "Content-Type": "text/html" } });
    }

  } catch (error: any) {
    console.error("Auto approval error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
