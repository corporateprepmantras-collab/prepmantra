import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import FAQ from "@/models/faqSchema";

// GET: Fetch distinct FAQ categories
export async function GET() {
  try {
    await connectMongoDB();
    const categories = await FAQ.distinct("category");
    return NextResponse.json(
      {
        message: "FAQ categories retrieved successfully",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving FAQ categories:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving FAQ categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}