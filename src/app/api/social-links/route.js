import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import SocialLink from "@/models/socialLinkSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET: Fetch all social links
export async function GET() {
  try {
    await connectMongoDB();
    const links = await SocialLink.find().populate("lastUpdatedBy", "name email");
    return NextResponse.json(
      {
        message: "Social links retrieved successfully",
        data: links,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch social links",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Add a new social link
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

    const { icon, url } = await request.json();
    if (!icon || !url) {
      return NextResponse.json(
        { message: "Icon and URL are required" },
        { status: 400 }
      );
    }

    const newLink = new SocialLink({
      icon,
      url,
      lastUpdatedBy: session.user.id,
    });

    const saved = await newLink.save();
    return NextResponse.json(
      {
        message: "Social link created successfully",
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding social link:", error);
    return NextResponse.json(
      {
        message: "Failed to add social link",
        error: error.message,
      },
      { status: 500 }
    );
  }
}