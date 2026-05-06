// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Exam from "@/models/examSchema";
// import mongoose from "mongoose";

// // GET: Fetch exams by product ID
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const { productId } = params;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return NextResponse.json(
//         { message: "Invalid product ID" },
//         { status: 400 }
//       );
//     }

//     const exams = await Exam.find({ productId })
//       .populate("lastUpdatedBy", "name email")
//       .populate("productId", "title slug")
//       .populate("courseId", "name");

//     return NextResponse.json(
//       {
//         message: "Exams retrieved successfully",
//         data: exams,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching exams for product:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch exams for product",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/announcements/route.js
export async function GET() {
  return new Response("Not implemented", { status: 404 });
}
