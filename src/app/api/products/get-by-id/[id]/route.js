import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Product from "@/models/productListSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch a product by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const product = await Product.findById(params.id).populate(
      "lastUpdatedBy",
      "name email"
    );
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product retrieved successfully", data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a product
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

    const formData = await request.formData();
    const fields = [
      "sapExamCode",
      "title",
      "price",
      "category",
      "status",
      "action",
      "onlinePriceInr",
      "onlinePriceUsd",
      "onlineMrpInr",
      "onlineMrpUsd",
      "comboPriceInr",
      "comboPriceUsd",
      "comboMrpInr",
      "comboMrpUsd",
      "dumpsPriceInr",
      "dumpsPriceUsd",
      "dumpsMrpInr",
      "dumpsMrpUsd",
      "sku",
      "longDescription",
      "Description",
      "slug",
      "metaTitle",
      "metaKeywords",
      "metaDescription",
      "schema",
    ];
    const updates = {};
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) updates[field] = value;
    });

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const imageFile = formData.get("image");
    if (imageFile) {
      const imageResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        imageFile.stream().pipe(stream);
      });
      updates.imageUrl = imageResult.secure_url;
    }

    const samplePdfFile = formData.get("samplePdf");
    if (samplePdfFile) {
      const samplePdfResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "product_pdfs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        samplePdfFile.stream().pipe(stream);
      });
      updates.samplePdfUrl = samplePdfResult.secure_url;
    }

    const mainPdfFile = formData.get("mainPdf");
    if (mainPdfFile) {
      const mainPdfResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "product_pdfs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        mainPdfFile.stream().pipe(stream);
      });
      updates.mainPdfUrl = mainPdfResult.secure_url;
    }

    updates.lastUpdatedBy = session.user.id;

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("lastUpdatedBy", "name email");

    return NextResponse.json(
      { message: "Product updated successfully", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Server error during update", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
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

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Product deleted successfully", deletedId: params.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Server error during deletion", error: error.message },
      { status: 500 }
    );
  }
}