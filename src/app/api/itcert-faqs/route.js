import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ItCertFaq from "@/models/itCertFaq";
import { serializeMongoArray, serializeMongoDoc } from "@/lib/mongoHelpers";

export async function GET() {
  try {
    await connectMongoDB();
    const faqs = await ItCertFaq.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(serializeMongoArray(faqs), { status: 200 });
  } catch (err) {
    console.error("❌ /api/itcert-faqs error:", err);
    return NextResponse.json(
      { message: "Failed to fetch IT cert FAQs", error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const {
      question,
      answer,
      order = 0,
      isActive = true,
    } = await request.json();
    if (!question || !answer) {
      return NextResponse.json(
        { message: "Both question and answer are required." },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const newFaq = await ItCertFaq.create({
      question,
      answer,
      order,
      isActive,
    });
    return NextResponse.json(serializeMongoDoc(newFaq.toObject()), {
      status: 201,
    });
  } catch (err) {
    console.error("❌ /api/itcert-faqs POST error:", err);
    return NextResponse.json(
      { message: "Failed to add FAQ", error: err.message },
      { status: 500 },
    );
  }
}
