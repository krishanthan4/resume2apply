import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import CoverLetterTemplate from "@/app/models/CoverLetterTemplate";
import { getSession } from "@/app/lib/auth";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    const updatedTemplate = await CoverLetterTemplate.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTemplate });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;

    const deletedTemplate = await CoverLetterTemplate.findOneAndDelete({
      _id: id,
      userId: session.userId
    });

    if (!deletedTemplate) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

