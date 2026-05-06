// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Exam from "@/models/examSchema";
// import mongoose from "mongoose";

// // GET: Fetch exams by course ID
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const { courseId } = params;

//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       return NextResponse.json(
//         { message: "Invalid course ID" },
//         { status: 400 }
//       );
//     }

//     const exams = await Exam.find({ courseId: new mongoose.Types.ObjectId(courseId) })
//       .populate("lastUpdatedBy", "name email")
//       .populate("productId", "title slug")
//       .populate("courseId", "name");

//     if (!exams || exams.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "No exams found for this course ID",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         data: exams,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching exams by course ID:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch exams",
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
