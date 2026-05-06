// const { NextResponse } = require("next/server");
// const { getServerSession } = require("next-auth");
// const User = require("@/models/User");
// const connectMongoDB = require("@/lib/mongodb");
// const { authOptions } = require("@/lib/auth/authOptions");

// async function POST(req) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   await connectMongoDB();
//   const user = await User.findById(session.user.id);

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   user.subscription = "yes";
//   await user.save(); // triggers pre-save hook

//   return NextResponse.json({ message: "Subscription updated" });
// }

// module.exports = { POST };
// src/app/api/announcements/route.js
export async function GET() {
  return new Response("Not implemented", { status: 404 });
}
