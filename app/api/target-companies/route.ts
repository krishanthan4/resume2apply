import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import TargetCompany from "@/app/models/TargetCompany";

export async function GET() {
  try {
    await dbConnect();
    const targets = await TargetCompany.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: targets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const target = await TargetCompany.create(body);
    return NextResponse.json({ success: true, data: target }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
