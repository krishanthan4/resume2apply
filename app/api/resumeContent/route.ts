import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import Resume from "@/app/models/Resume";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    // Assuming single-user mode for now, fetch the first resume
    let resume = await Resume.findOne().lean();
    if (!resume) {
      resume = {};
    }

    const execTemplates = await ExecutiveSummaryTemplate.find().lean();
    const generalExecSummary = await ExecutiveSummaryTemplate.findOne({ title: { $regex: /general executive summary/i } }).lean();

    return NextResponse.json({
      success: true,
      resumeData: {
        ...resume,
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
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    let result;
    if (!_id) {
      // Create new dummy userId if not authenticated
      const dummyUserId = new mongoose.Types.ObjectId();
      result = await Resume.create({ ...updateData, userId: dummyUserId });
    } else {
      result = await Resume.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, upsert: true }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database update error:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}
