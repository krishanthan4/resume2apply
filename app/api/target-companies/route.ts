import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import TargetCompany from "@/app/models/TargetCompany";
import { getSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const targets = await TargetCompany.find({ userId: session.userId }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: targets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const target = await TargetCompany.create({ ...body, userId: session.userId });
    return NextResponse.json({ success: true, data: target }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { updates } = body;

    // Ensure each update belongs to the user
    const promises = updates.map((update: any, index: number) => {
      return TargetCompany.findOneAndUpdate(
        { _id: update._id, userId: session.userId },
        { ...update, order: index },
        { new: true }
      );
    });

    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

