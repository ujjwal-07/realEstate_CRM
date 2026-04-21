import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [totalLeads, sourceStats, statusStats] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    const closedLeads = statusStats.find(s => s._id === "Closed")?.count || 0;
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        conversionRate: Number(conversionRate),
        leadsBySource: sourceStats,
        statusDistribution: statusStats,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}