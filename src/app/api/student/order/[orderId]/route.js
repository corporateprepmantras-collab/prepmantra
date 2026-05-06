import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Order from "@/models/orderSchema";
import UserInfo from "@/models/userInfoSchema";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import Product from "@/models/productListSchema"; // Add this import

// Define authUsers model to ensure it's registered before use
const authUserModel = mongoose.models.authUsers || mongoose.model('authUsers', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  emailVerified: { type: Date },
}, { collection: 'authUsers' }));

export async function GET(request, context) {
  try {
    console.log("Route hit: /api/student/order/[orderId] [GET]");
    await connectMongoDB();

    // In Next.js 15, params must be awaited
    const params = await context.params;
    const orderId = params.orderId;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("Invalid orderId:", orderId);
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user?.id) {
      console.error("Unauthorized: No valid session", {
        sessionExists: !!session,
        userId: session?.user?.id || "none",
      });
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await UserInfo.findOne({ authUserId: userId }).select("role");
    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the specific order
    const order = await Order.findById(orderId)
      .populate("user", "name email") // Populates user details from authUsers
      .populate("courseDetails.courseId", "title")
      .lean();

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Access control: Admin can view any order, students can only view their own orders
    // Safely handle both populated and unpopulated user references
    const orderUserId = typeof order.user === 'object' ? order.user._id.toString() : order.user.toString();
    
    if (user.role === "admin" || (user.role === "student" && orderUserId === userId)) {
      console.log("Order retrieved:", {
        orderId,
        userId,
        role: user.role,
      });
      return NextResponse.json({ order });
    } else {
      console.error("Forbidden: User cannot access this order", {
        userId,
        orderId,
        role: user.role,
      });
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to view this order" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Order retrieval failed:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Order retrieval failed: ${error.message}` },
      { status: 500 }
    );
  }
}

async function getStudentOrders(request) {
  try {
    console.log("Route hit: /api/student/orders [GET]");
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user?.id) {
      console.error("Unauthorized: No valid session", {
        sessionExists: !!session,
        userId: session?.user?.id || "none",
      });
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await UserInfo.findOne({ authUserId: userId }).select("role");
    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "student" && user.role !== "admin") {
      console.error("Forbidden: User is not a student or admin", {
        userId,
        role: user.role,
      });
      return NextResponse.json(
        { error: "Forbidden: Access restricted to students or admins" },
        { status: 403 }
      );
    }

    const orders = await Order.find({ user: userId })
      .populate("user", "name email") // Populates user details from authUsers
      .populate("courseDetails.courseId", "title")
      .sort({ purchaseDate: -1 })
      .lean();

    console.log("Orders retrieved for user:", {
      count: orders.length,
      userId,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order retrieval failed:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Order retrieval failed: ${error.message}` },
      { status: 500 }
    );
  }
}