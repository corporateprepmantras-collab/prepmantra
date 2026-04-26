// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Contact from "@/models/contactSchema";
//
// // GET: Fetch a contact submission by ID
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const contact = await Contact.findById(params.id);
//     if (!contact) {
//       return NextResponse.json(
//         { message: "Contact submission not found" },
//         { status: 404 }
//       );
//     }

//     if (contact.status === "new") {
//       contact.status = "read";
//       await contact.save();
//     }

//     return NextResponse.json(
//       {
//         message: "Contact submission retrieved successfully",
//         data: contact,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving contact submission:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while retrieving contact submission",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // PUT: Update contact status and notes
// export async function PUT(request, { params }) {
//   try {
//     await connectMongoDB();
//     const { status, notes } = await request.json();
//     const contact = await Contact.findById(params.id);

//     if (!contact) {
//       return NextResponse.json(
//         { message: "Contact submission not found" },
//         { status: 404 }
//       );
//     }

//     if (status) contact.status = status;
//     if (notes !== undefined) contact.notes = notes;

//     await contact.save();

//     return NextResponse.json(
//       {
//         message: "Contact submission updated successfully",
//         data: contact,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating contact submission:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while updating contact submission",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: Delete a contact submission
// export async function DELETE(request, { params }) {
//   try {
//     await connectMongoDB();
//     const contact = await Contact.findById(params.id);
//     if (!contact) {
//       return NextResponse.json(
//         { message: "Contact submission not found" },
//         { status: 404 }
//       );
//     }

//     await Contact.findByIdAndDelete(params.id);

//     return NextResponse.json(
//       {
//         message: "Contact submission deleted successfully",
//         deletedId: params.id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting contact submission:", error);
//     return NextResponse.json(
//       {
//         message: "Server error while deleting contact submission",
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
