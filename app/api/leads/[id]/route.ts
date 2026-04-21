import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { leadSchema } from "@/lib/validation";

// Next.js 15 requires params to be a Promise
type RouteParams = { params: Promise<{ id: string }> };

interface HistoryEvent {
  action: string;
  details: string;
  date: Date;
}
// GET: Fetch a single lead by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // <-- UNWRAP THE PROMISE
    
    await connectDB();
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update a lead with Zod Validation
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // 2. Next.js 15: Await the dynamic parameters
    const { id } = await params;
    const body = await request.json();
    
    // 3. Validation: Use .partial() so we don't require the whole object for an update
    const updateSchema = leadSchema.partial();
    const validationResult = updateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // 4. Fetch the existing record to compare values
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const updateData = validationResult.data;
    
    // 5. Fixed Error: Explicitly type the history array as HistoryEvent[]
    const newHistoryEvents: HistoryEvent[] = [];

    // Fields we want to audit for changes
    const fieldsToTrack = ["name", "phone", "email", "budget", "location", "propertyType", "status"];
    
    fieldsToTrack.forEach((field) => {
      // Check if field is in the update and is different from current value
      if (
        updateData[field as keyof typeof updateData] !== undefined && 
        String(updateData[field as keyof typeof updateData]) !== String(existingLead[field])
      ) {
        newHistoryEvents.push({
          action: `${field.charAt(0).toUpperCase() + field.slice(1)} Updated`,
          details: `Changed from "${existingLead[field]}" to "${updateData[field as keyof typeof updateData]}"`,
          date: new Date()
        });
      }
    });

    // 6. Perform the Update
    // $set updates the fields, $push appends the audit trail to the history array
    const updateOp: any = { $set: updateData };
    
    if (newHistoryEvents.length > 0) {
      updateOp.$push = { history: { $each: newHistoryEvents } };
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateOp, {
      new: true, // Returns the modified document
      runValidators: true, 
    });

    return NextResponse.json({ success: true, data: updatedLead }, { status: 200 });

  } catch (error: any) {
    console.error("PUT /api/leads/[id] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a lead
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // <-- UNWRAP THE PROMISE
    
    await connectDB();
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}