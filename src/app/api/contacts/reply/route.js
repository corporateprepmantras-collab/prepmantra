// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Contact from "@/models/contactSchema";
// import { sendReplyEmail } from "@/lib/email/nodemailer";

// // POST: Reply to a contact submission
// export async function POST(request, { params }) {
//   try {
//     await connectMongoDB();
//     const { replyMessage, subject } = await request.json();

//     if (!replyMessage) {
//       return NextResponse.json(
//         { message: "Reply message is required" },
//         { status: 400 }
//       );
//     }

//     const contact = await Contact.findById(params.id);
//     if (!contact) {
//       return NextResponse.json(
//         { message: "Contact submission not found" },
//         { status: 404 }
//       );
//     }

//     await sendReplyEmail(contact, replyMessage, subject);

//     contact.status = "replied";
//     contact.notes = contact.notes
//       ? `${contact.notes}\n\n[${new Date().toISOString()}] Replied: ${replyMessage.substring(0, 100)}...`
//       : `[${new Date().toISOString()}] Replied: ${replyMessage.substring(0, 100)}...`;

//     await contact.save();

//     return NextResponse.json(
//       {
//         message: "Reply sent successfully",
//         data: contact,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error replying to contact:", error);
//     return NextResponse.json(
//       {
//         message: error.message.includes("Email configuration")
//           ? "Failed to send reply email"
//           : "Server error while replying to contact",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }// src/app/api/announcements/route.js
export async function GET() {
  return new Response("Not implemented", { status: 404 });
}
