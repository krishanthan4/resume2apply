import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import { getSession } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { type, title, content, shortSummary, detailedSummary } = data;

    if (!type || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "coverLetterTemplate" && type !== "executiveSummaryTemplate") {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    let result;
    if (type === "coverLetterTemplate") {
      result = await CoverLetterTemplate.create({
        userId: session.userId,
        name: title,
        subject: title,
        body: content,
      });
    } else {
      result = await ExecutiveSummaryTemplate.create({
        userId: session.userId,
        title,
        shortSummary: shortSummary || "",
        detailedSummary: detailedSummary || shortSummary || "",
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database creation error:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

