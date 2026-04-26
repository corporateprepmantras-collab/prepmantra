import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Testimonial from "@/models/testimonialSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all testimonials with filtering
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    const query = {};
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const testimonials = await Testimonial.find(query)
      .populate("lastUpdatedBy", "name email")
      .sort({ order: 1 });

    return NextResponse.json(
      {
        message: "Testimonials retrieved successfully",
        data: testimonials,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving testimonials",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new testimonial
export async function POST(request) {
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
    const name = formData.get("name");
    const position = formData.get("position");
    const company = formData.get("company");
    const content = formData.get("content");
    const rating = formData.get("rating") ? parseInt(formData.get("rating")) : 5;
    const isActive = formData.get("isActive") ? formData.get("isActive") === "true" : true;
    const order = formData.get("order") ? parseInt(formData.get("order")) : 0;
    const file = formData.get("file");

    if (!name || !content) {
      return NextResponse.json(
        { message: "Name and content are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "testimonials" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        file.stream().pipe(stream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const newTestimonial = new Testimonial({
      name,
      position,
      company,
      content,
      rating,
      imageUrl,
      isActive,
      order,
      lastUpdatedBy: session.user.id,
    });

    const saved = await newTestimonial.save();

    return NextResponse.json(
      {
        message: "Testimonial created successfully",
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      {
        message: "Server error during testimonial creation",
        error: error.message,
      },
      { status: 500 }
    );
  }
}