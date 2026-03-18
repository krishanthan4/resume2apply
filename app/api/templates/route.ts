import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { type, title, content, shortSummery, detailedSummery } = data;

    if (!type || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "coverLetterTemplate" && type !== "executiveSummaryTemplate") {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    let result;
    if (type === "coverLetterTemplate") {
      result = await CoverLetterTemplate.create({
        name: title,
        subject: title, // You can make this dynamic
        body: content,
      });
    } else {
      result = await ExecutiveSummaryTemplate.create({
        title,
        shortSummery: shortSummery || "",
        detailedSummery: detailedSummery || shortSummery || "",
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database creation error:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
