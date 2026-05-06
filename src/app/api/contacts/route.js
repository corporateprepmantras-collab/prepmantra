// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Contact from "@/models/con";
// import { sendNotificationEmail } from "@/lib/email/nodemailer";

// // GET: Fetch all contacts with pagination and filtering
// export async function GET(request) {
//   try {
//     await connectMongoDB();
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const sortBy = searchParams.get("sortBy") || "createdAt";
//     const sortOrder = searchParams.get("sortOrder") || "desc";

//     const query = status ? { status } : {};
//     const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
//     const skip = (page - 1) * limit;

//     const contacts = await Contact.find(query)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);
//     const total = await Contact.countDocuments(query);

//     return NextResponse.json(
//       {
//         message: "Contact submissions retrieved successfully",
//         data: contacts,
//         pagination: {
//           total,
//           page,
//           limit,
//           pages: Math.ceil(total / limit),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving contact submissions:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while retrieving contact submissions",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // POST: Submit a new contact form
// export async function POST(request) {
//   try {
//     await connectMongoDB();
//     const { name, email, phone, subject, message } = await request.json();

//     if (!name || !email || !message) {
//       return NextResponse.json(
//         { message: "Name, email, and message are required fields" },
//         { status: 400 }
//       );
//     }

//     const newContact = new Contact({
//       name,
//       email,
//       phone: phone || "",
//       subject: subject || "General Inquiry",
//       message,
//       ipAddress: request.headers.get("x-forwarded-for") || "unknown",
//       userAgent: request.headers.get("user-agent") || "unknown",
//     });

//     await newContact.save();

//     try {
//       await sendNotificationEmail(newContact);
//     } catch (emailError) {
//       console.error("Failed to send notification email:", emailError);
//     }

//     return NextResponse.json(
//       {
//         message: "Your message has been sent successfully. We will get back to you soon.",
//         success: true,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error submitting contact form:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while submitting your message. Please try again later.",
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
