// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Testimonial from "@/models/testimonialSchema";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth/authOptions";
// import { deleteFromCloudinary } from "@/utils/cloudinary";
// import cloudinary from "cloudinary";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // GET: Fetch a testimonial by ID
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const testimonial = await Testimonial.findById(params.id).populate(
//       "lastUpdatedBy",
//       "name email"
//     );
//     if (!testimonial) {
//       return NextResponse.json(
//         { message: "Testimonial not found" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       {
//         message: "Testimonial retrieved successfully",
//         data: testimonial,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving testimonial:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while retrieving testimonial",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // PUT: Update a testimonial
// export async function PUT(request, { params }) {
//   try {
//     await connectMongoDB();
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "admin") {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();
//     const name = formData.get("name");
//     const position = formData.get("position");
//     const company = formData.get("company");
//     const content = formData.get("content");
//     const rating = formData.get("rating") ? parseInt(formData.get("rating")) : undefined;
//     const isActive = formData.get("isActive") ? formData.get("isActive") === "true" : undefined;
//     const order = formData.get("order") ? parseInt(formData.get("order")) : undefined;
//     const file = formData.get("file");

//     const existingTestimonial = await Testimonial.findById(params.id);
//     if (!existingTestimonial) {
//       return NextResponse.json(
//         { message: "Testimonial not found" },
//         { status: 404 }
//       );
//     }

//     const updates = {
//       lastUpdatedBy: session.user.id,
//     };
//     if (name) updates.name = name;
//     if (position !== undefined) updates.position = position;
//     if (company !== undefined) updates.company = company;
//     if (content) updates.content = content;
//     if (rating !== undefined) updates.rating = rating;
//     if (isActive !== undefined) updates.isActive = isActive;
//     if (order !== undefined) updates.order = order;

//     if (file) {
//       if (existingTestimonial.imageUrl) {
//         try {
//           const publicId = existingTestimonial.imageUrl.split("/").pop().split(".")[0];
//           await deleteFromCloudinary(`testimonials/${publicId}`);
//         } catch (cloudinaryError) {
//           console.warn("Error deleting old image from Cloudinary:", cloudinaryError);
//         }
//       }
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.v2.uploader.upload_stream(
//           { folder: "testimonials" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         file.stream().pipe(stream);
//       });
//       updates.imageUrl = uploadResult.secure_url;
//     }

//     const updatedTestimonial = await Testimonial.findByIdAndUpdate(params.id, updates, {
//       new: true,
//       runValidators: true,
//     }).populate("lastUpdatedBy", "name email");

//     return NextResponse.json(
//       {
//         message: "Testimonial updated successfully",
//         data: updatedTestimonial,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating testimonial:", error);
//     return NextResponse.json(
//       {
//         message: "Server error during testimonial update",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: Delete a testimonial
// export async function DELETE(request, { params }) {
//   try {
//     await connectMongoDB();
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "admin") {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const testimonial = await Testimonial.findById(params.id);
//     if (!testimonial) {
//       return NextResponse.json(
//         { message: "Testimonial not found" },
//         { status: 404 }
//       );
//     }

//     if (testimonial.imageUrl) {
//       try {
//         const publicId = testimonial.imageUrl.split("/").pop().split(".")[0];
//         await deleteFromCloudinary(`testimonials/${publicId}`);
//       } catch (cloudinaryError) {
//         console.warn("Error deleting image from Cloudinary:", cloudinaryError);
//       }
//     }

//     await Testimonial.findByIdAndDelete(params.id);

//     return NextResponse.json(
//       {
//         message: "Testimonial deleted successfully",
//         deletedId: params.id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting testimonial:", error);
//     return NextResponse.json(
//       {
//         message: "Server error during testimonial deletion",
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
// hkjhkjh