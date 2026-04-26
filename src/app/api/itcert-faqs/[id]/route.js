import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ItCertFaq from "@/models/itCertFaq";
import { serializeMongoDoc } from "@/lib/mongoHelpers";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { question, answer, order, isActive } = await request.json();
    if (!question || !answer) {
      return NextResponse.json(
        { message: "Both question and answer are required." },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const faq = await ItCertFaq.findById(id);
    if (!faq)
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });

    faq.question = question;
    faq.answer = answer;
    if (typeof order !== "undefined") faq.order = order;
    if (typeof isActive !== "undefined") faq.isActive = isActive;
    await faq.save();

    return NextResponse.json(serializeMongoDoc(faq.toObject()), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ /api/itcert-faqs/[id] PUT error:", err);
    return NextResponse.json(
      { message: "Failed to update FAQ", error: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const faq = await ItCertFaq.findById(id);
    if (!faq)
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });

    await faq.deleteOne();
    return NextResponse.json({ message: "FAQ deleted" }, { status: 200 });
  } catch (err) {
    console.error("❌ /api/itcert-faqs/[id] DELETE error:", err);
    return NextResponse.json(
      { message: "Failed to delete FAQ", error: err.message },
      { status: 500 },
    );
  }
}
