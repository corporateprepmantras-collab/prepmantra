import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import FAQ from "@/models/faqSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET: Fetch an FAQ by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const faq = await FAQ.findById(params.id).populate(
      "lastUpdatedBy",
      "name email"
    );
    if (!faq) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "FAQ retrieved successfully",
        data: faq,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving FAQ:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update an FAQ
export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { question, answer, category, order, isActive } = await request.json();
    const existingFAQ = await FAQ.findById(params.id);
    if (!existingFAQ) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }

    const updates = {
      question: question || existingFAQ.question,
      answer: answer || existingFAQ.answer,
      category: category || existingFAQ.category,
      lastUpdatedBy: session.user.id,
    };
    if (order !== undefined) updates.order = order;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedFAQ = await FAQ.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("lastUpdatedBy", "name email");

    return NextResponse.json(
      {
        message: "FAQ updated successfully",
        data: updatedFAQ,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      {
        message: "Server error during FAQ update",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete an FAQ
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const faq = await FAQ.findById(params.id);
    if (!faq) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }

    await FAQ.findByIdAndDelete(params.id);

    return NextResponse.json(
      {
        message: "FAQ deleted successfully",
        deletedId: params.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      {
        message: "Server error during FAQ deletion",
        error: error.message,
      },
      { status: 500 }
    );
  }
}