import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import ResumeDocument from "@/app/components/visitor-resume/sections/MainResumePage";

export async function POST(request: Request) {
  try {
    const configData = await request.json();

    // Render to stream with the incoming config
    const stream = await renderToStream(
      <ResumeDocument config={configData} type={configData.type || "detailed"} isEditor={true} />
    );

    // Convert string to Response
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="preview.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF preview" },
      { status: 500 }
    );
  }
}
