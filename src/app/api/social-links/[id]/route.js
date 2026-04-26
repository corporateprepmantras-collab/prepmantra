import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import SocialLink from "@/models/socialLinkSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// PUT: Update a social link
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

    const { icon, url } = await request.json();
    if (!icon || !url) {
      return NextResponse.json(
        { message: "Icon and URL are required" },
        { status: 400 }
      );
    }

    const updated = await SocialLink.findByIdAndUpdate(
      params.id,
      { icon, url, lastUpdatedBy: session.user.id },
      { new: true, runValidators: true }
    ).populate("lastUpdatedBy", "name email");

    if (!updated) {
      return NextResponse.json(
        { message: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Social link updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      {
        message: "Failed to update social link",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a social link
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

    const link = await SocialLink.findByIdAndDelete(params.id);
    if (!link) {
      return NextResponse.json(
        { message: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Social link deleted successfully",
        deletedId: params.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      {
        message: "Failed to delete social link",
        error: error.message,
      },
      { status: 500 }
    );
  }
}