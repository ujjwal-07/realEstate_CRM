import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { note } = await request.json();

    await connectDB();
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $push: { notes: note } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}