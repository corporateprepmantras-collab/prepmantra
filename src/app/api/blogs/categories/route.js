import { NextResponse } from "next/server";
// import { createBlogCategory, getAllBlogCategories } from "@/controllers/blogCategoryController";
// import { parser } from "@/utils/cloudinary";

// GET: /api/blog/categories/
export async function GET() {
  try {
    const categories = await getAllBlogCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// // POST: /api/blog/categories/
// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("image");
//     const fields = Object.fromEntries(formData);

//     let uploadedImage = null;
//     if (file) {
//       uploadedImage = await parser(file); // upload to cloudinary
//     }

//     const newCategory = await createBlogCategory({
//       ...fields,
//       image: uploadedImage?.secure_url || null,
//     });

//     return NextResponse.json(newCategory, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
