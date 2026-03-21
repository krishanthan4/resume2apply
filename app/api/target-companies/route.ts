import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/mongodb";
import TargetCompany from "@/app/models/TargetCompany";

export async function GET() {
  try {
    await dbConnect();
    // Default fallback order sort by order (if field exists), then by date
    const targets = await TargetCompany.find({}).sort({ order: 1, createdAt: -1 });
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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { updates } = body;
    
    // updates should be an array of objects from dnd list
    // where each item has {_id, ...otherFields}
    const promises = updates.map((update: any, index: number) => {
      // Allow overriding an order/index if you want or just push bulk update
      return TargetCompany.findByIdAndUpdate(update._id, { ...update, order: index }, { new: true });
    });
    
    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
