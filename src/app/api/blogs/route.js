import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import { Blog } from "@/models";
import { uploadToCloudinaryBlog } from "@/lib/cloudinary";
import { serializeMongoArray, serializeMongoDoc } from "@/lib/mongoHelpers";

/* ===========================
   GET: List Blogs
=========================== */
export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Filter published blogs for public API
    query.status = "publish";

    const blogs = await Blog.find(query)
      .populate("category", "sectionName category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      data: serializeMongoArray(blogs),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ GET /api/blogs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===========================
   POST: Create Blog
   (NO VALIDATION)
=========================== */
export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();

    let imageUrl = "";
    let imagePublicId = "";

    const image = formData.get("image");

    // upload ONLY if image exists
    if (image && typeof image === "object") {
      const uploadResult = await uploadToCloudinaryBlog(image);
      imageUrl = uploadResult?.secure_url || "";
      imagePublicId = uploadResult?.public_id || "";
    }

    const title = (formData.get("title") || "").toString().trim() || "Untitled";
    const content =
      (formData.get("content") || "").toString().trim() ||
      "<p>No content yet.</p>";
    const slugRaw = (formData.get("slug") || "").toString().trim();
    const slug =
      slugRaw ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 120);

    const metaTitle =
      (formData.get("metaTitle") || "").toString().trim() || title;
    const metaKeywords =
      (formData.get("metaKeywords") || "").toString().trim() || title;
    const metaDescription =
      (formData.get("metaDescription") || "").toString().trim() ||
      title.slice(0, 160);

    let schemaRaw = (formData.get("schema") || "").toString().trim();
    if (!schemaRaw) schemaRaw = "{}";
    try {
      JSON.parse(schemaRaw);
    } catch {
      schemaRaw = "{}";
    }

    const blogData = {
      title,
      content,
      category: formData.get("category"),
      slug,

      imageUrl: imageUrl || "/og-image.png",
      imagePublicId,

      status: formData.get("status") || "unpublish",

      metaTitle,
      metaKeywords,
      metaDescription,

      schema: schemaRaw,
    };

    const blog = await Blog.create(blogData);

    return NextResponse.json(
      { data: serializeMongoDoc(blog.toObject()) },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ POST /api/blogs error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This slug is already in use. Choose a different slug." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
