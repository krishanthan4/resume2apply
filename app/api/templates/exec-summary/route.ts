import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import { getSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const templates = await ExecutiveSummaryTemplate.find({ userId: session.userId }, '_id title');
    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

