import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";

export async function GET() {
  try {
    await dbConnect();
    const templates = await ExecutiveSummaryTemplate.find({}, '_id title');
    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
