import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import dbConnect from "@/app/utils/mongodb";
import Resume from "@/app/models/Resume";
import ExecutiveSummaryTemplate from "@/app/models/ExecutiveSummaryTemplate";
import ResumeDocument from "@/app/components/visitor-resume/sections/MainResumePage";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "single";
    const execSummaryId = searchParams.get("execSummaryId");

    // Fetch the first resume configuration (or by user if auth implemented)
    const resumeData = await Resume.findOne().lean() || {};
    
    // Fetch executive summary
    let generalSummaryData = null;
    if (execSummaryId) {
      generalSummaryData = await ExecutiveSummaryTemplate.findById(execSummaryId).lean();
    } else {
      generalSummaryData = await ExecutiveSummaryTemplate.findOne({ title: { $regex: /general executive summary/i } }).lean();
    }

    const isSingle = type.includes("single");

    // Default configuration corresponding to the editor presets
    const defaultConfigOverrides = isSingle ? {
      subTitlesSpaceBottom: 1,
      headerNameMarginBottom: 0,
      sectionTitleBoxMarginTop: 5,
      sectionTitleBoxMarginBottom: 3,
      sectionTitleBoxPaddingTop: 5,
      pagePaddingTop: 0.2,
      pagePaddingBottom: 0.1,
      pagePaddingLeft: 0.3,
      pagePaddingRight: 0.3,
      maxProjects: 2,
      maxExperienceBullets: 4,
      maxProjectBullets: 3,
      noHyperlinks: type === "downloadable_single"
    } : {
      subTitlesSpaceBottom: 2,
      headerNameMarginBottom: 3,
      sectionTitleBoxMarginTop: 8,
      sectionTitleBoxMarginBottom: 5,
      sectionTitleBoxPaddingTop: 8,
      pagePaddingTop: 0.3,
      pagePaddingBottom: 0.3,
      pagePaddingLeft: 0.4,
      pagePaddingRight: 0.4,
      maxProjects: 4,
      maxExperienceBullets: 7,
      maxProjectBullets: 4,
      noHyperlinks: type === "downloadable_detailed"
    };

    const fullConfigData = { 
      ...resumeData, 
      ...defaultConfigOverrides,
      dividerPosition: "top", // ensure divider is top
      generalExecutiveSummary: generalSummaryData 
    };

    // Render to stream
    const stream = await renderToStream(
      <ResumeDocument config={fullConfigData} type={type} />,
    );

    // Convert string to Response
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${type}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
