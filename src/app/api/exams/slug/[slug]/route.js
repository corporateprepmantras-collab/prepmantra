// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Exam from "@/models/examSchema";
// import Product from "@/models/productSchema";

// // GET: Fetch exams by product slug
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const { slug } = params;

//     const product = await Product.findOne({ slug });
//     if (!product) {
//       return NextResponse.json(
//         { message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     const exams = await Exam.find({ productId: product._id })
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
//     console.error("Error fetching exams for product slug:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch exams for product slug",
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
