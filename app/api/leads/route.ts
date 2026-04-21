import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { leadSchema } from "@/lib/validation";

// GET: Fetch all leads
export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 }); 
    
    return NextResponse.json({ success: true, data: leads }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST: Create a new lead with Zod Validation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate incoming data against the Zod schema
    const validationResult = leadSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return 400 Bad Request with specific field errors
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // 2. Connect to DB and insert the validated data
    await connectDB();
    const newLead = await Lead.create(validationResult.data);

    return NextResponse.json(
      { success: true, data: newLead },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}