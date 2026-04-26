import { NextResponse } from "next/server";
// import {
//   getBlogCategoryById,
//   updateBlogCategory,
//   deleteBlogCategory,
// } from "@/controllers/blogCategoryController";
// import { parser } from "@/utils/cloudinary";

// GET: /api/blog/categories/:id
// export async function GET(_, { params }) {
//   try {
//     const category = await getBlogCategoryById(params.id);
//     return NextResponse.json(category);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// PUT: /api/blog/categories/:id
// export async function PUT(req, { params }) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("image");
//     const fields = Object.fromEntries(formData);

//     let uploadedImage = null;
//     if (file) {
//       uploadedImage = await parser(file);
//     }

//     const updatedCategory = await updateBlogCategory(params.id, {
//       ...fields,
//       image: uploadedImage?.secure_url || undefined,
//     });

//     return NextResponse.json(updatedCategory);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// DELETE: /api/blog/categories/:id
// export async function DELETE(_, { params }) {
//   try {
//     await deleteBlogCategory(params.id);
//     return NextResponse.json({ message: "Category deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// src/app/api/announcements/route.js
export async function GET() {
  return new Response("Not implemented", { status: 404 });
}
