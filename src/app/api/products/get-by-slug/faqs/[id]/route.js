import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Product from "@/models/productListSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET: Fetch FAQs for a product
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "FAQs retrieved successfully", faqs: product.faqs || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQs", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add FAQ to a product
export async function POST(request, { params }) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const newFaq = { question, answer };
    product.faqs.push(newFaq);
    await product.save();

    return NextResponse.json(
      { message: "FAQ added successfully", faq: newFaq },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return NextResponse.json(
      { message: "Failed to add FAQ", error: error.message },
      { status: 500 }
    );
  }
}