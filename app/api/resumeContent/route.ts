import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import BaseResume from "@/app/models/ResumeContent";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import { getSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let resume = await BaseResume.findOne({ userId: session.userId }).lean();

    const execTemplates = await ExecutiveSummaryTemplate.find({ userId: session.userId }).lean();
    const generalExecSummary = await ExecutiveSummaryTemplate.findOne({
      userId: session.userId,
      title: { $regex: /general executive summary/i }
    }).lean();

    return NextResponse.json({
      success: true,
      resumeData: {
        ...(resume || {}),
        generalExecutiveSummary: generalExecSummary || null
      },
      execTemplates,
    });
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch builder data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { _id, userId: bodyUserId, ...updateData } = body;

    let result = await BaseResume.findOneAndUpdate(
      { userId: session.userId },
      { $set: { ...updateData, userId: session.userId } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database update error:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

