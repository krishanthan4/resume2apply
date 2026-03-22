import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import TargetCompany from "@/app/models/TargetCompany";
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

    const target = await TargetCompany.findOneAndUpdate(
      { _id: id, userId: session.userId },
      body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!target) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: target });
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
    const deleted = await TargetCompany.findOneAndDelete({ _id: id, userId: session.userId });
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

