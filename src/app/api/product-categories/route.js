import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ProductCategory from "@/models/productCategorySchema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";


import fs from "fs";
import path from "path";
import { writeFile, unlink } from "fs/promises";



// 📌 GET all categories
export async function GET() {
  try {
    await connectMongoDB();
    const categories = await ProductCategory.find().lean();

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// 📌 POST - Create new category with image upload
export async function POST(req) {
  try {
    await connectMongoDB();

    const formData = await req.formData();

    // ✅ Extract fields
    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim() || "";
    const description = formData.get("description")?.toString() || "";
    const descriptionBelow = formData.get("descriptionBelow")?.toString() || "";
    const schemaHere = formData.get("schemaHere")?.toString() || ""; // ✅ New field
    const metaTitle = formData.get("metaTitle")?.toString() || "";
    const metaKeywords = formData.get("metaKeywords")?.toString() || "";
    const metaDescription = formData.get("metaDescription")?.toString() || "";
    const remarks = formData.get("remarks")?.toString() || "";
    const status = formData.get("status")?.toString().trim() || "Unpublish";
    const file = formData.get("image");

    // ✅ Parse FAQs from JSON string
    let faqs = [];
    const faqsString = formData.get("faqs");
    if (faqsString) {
      try {
        faqs = JSON.parse(faqsString);
        // Filter out empty FAQs
        faqs = faqs.filter((faq) => faq.question?.trim() && faq.answer?.trim());
      } catch (error) {
        console.error("FAQ parsing error:", error);
        return NextResponse.json(
          { message: "Invalid FAQ format" },
          { status: 400 },
        );
      }
    }

    // ✅ Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }
    if (!["Publish", "Unpublish"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // ✅ Upload image if provided
    // let imageUrl = "";
    // let publicId = "";
    // if (file instanceof File && file.type.startsWith("image/")) {
    //   const uploadResult = await uploadToCloudinary(file);
    //   if (!uploadResult.secure_url || !uploadResult.public_id) {
    //     throw new Error("Cloudinary upload failed");
    //   }
    //   imageUrl = uploadResult.secure_url;
    //   publicId = uploadResult.public_id;
    // }



// ✅ Save image locally if provided
    // ✅ Save image using remote PHP API
    let imageUrl = "";
    let publicId = "";

    if (file instanceof File && file.type.startsWith("image/") && file.size > 0) {
      const phpFormData = new FormData();
      phpFormData.append("image", file);

      try {
        const phpResponse = await fetch("https://examdumps360.com/prepmantra/upload.php", {
          method: "POST",
          body: phpFormData,
        });

        const uploadResult = await phpResponse.json();

        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          publicId = uploadResult.filename;
        } else {
          throw new Error(uploadResult.error || "PHP upload failed");
        }
      } catch (error) {
        console.error("PHP Upload Error:", error);
        return NextResponse.json(
          { message: "Image upload failed", error: error.message },
          { status: 500 }
        );
      }
    }

    // ✅ Save to MongoDB
    const newCategory = new ProductCategory({
      name,
      slug,
      description,
      descriptionBelow,
      schemaHere, // ✅ Include schemaHere
      metaTitle,
      metaKeywords,
      metaDescription,
      remarks,
      status,
      image: imageUrl,
      public_id: publicId,
      faqs,
    });

    const savedCategory = await newCategory.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// 📌 PUT - Update category
export async function PUT(req) {
  try {
    await connectMongoDB();

    const formData = await req.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    // Find existing category
    const existingCategory = await ProductCategory.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    // ✅ Extract fields
    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim() || "";
    const description = formData.get("description")?.toString() || "";
    const descriptionBelow = formData.get("descriptionBelow")?.toString() || "";
    const schemaHere = formData.get("schemaHere")?.toString() || ""; // ✅ New field
    const metaTitle = formData.get("metaTitle")?.toString() || "";
    const metaKeywords = formData.get("metaKeywords")?.toString() || "";
    const metaDescription = formData.get("metaDescription")?.toString() || "";
    const remarks = formData.get("remarks")?.toString() || "";
    const status = formData.get("status")?.toString().trim() || "Unpublish";
    const file = formData.get("image");

    // ✅ Parse FAQs from JSON string
    let faqs = existingCategory.faqs || [];
    const faqsString = formData.get("faqs");
    if (faqsString) {
      try {
        faqs = JSON.parse(faqsString);
        // Filter out empty FAQs
        faqs = faqs.filter((faq) => faq.question?.trim() && faq.answer?.trim());
      } catch (error) {
        console.error("FAQ parsing error:", error);
        return NextResponse.json(
          { message: "Invalid FAQ format" },
          { status: 400 },
        );
      }
    }

    // ✅ Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }
    if (!["Publish", "Unpublish"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // ✅ Handle image upload/update
    // let imageUrl = existingCategory.image;
    // let publicId = existingCategory.public_id;

    // if (file instanceof File && file.type.startsWith("image/")) {
    //   // Delete old image if exists
    //   if (existingCategory.public_id) {
    //     try {
    //       await deleteFromCloudinary(existingCategory.public_id);
    //     } catch (error) {
    //       console.error("Failed to delete old image:", error);
    //     }
    //   }

    //   // Upload new image
    //   const uploadResult = await uploadToCloudinary(file);
    //   if (!uploadResult.secure_url || !uploadResult.public_id) {
    //     throw new Error("Cloudinary upload failed");
    //   }
    //   imageUrl = uploadResult.secure_url;
    //   publicId = uploadResult.public_id;
    // }




// ✅ Handle local image update
    // ✅ Handle remote PHP image update
    let imageUrl = existingCategory.image;
    let publicId = existingCategory.public_id;

    if (file instanceof File && file.type.startsWith("image/") && file.size > 0) {
      const phpFormData = new FormData();
      phpFormData.append("image", file);

      try {
        const phpResponse = await fetch("https://examdumps360.com/prepmantra/upload.php", {
          method: "POST",
          body: phpFormData,
        });

        const uploadResult = await phpResponse.json();

        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          publicId = uploadResult.filename;
        } else {
          throw new Error(uploadResult.error || "PHP upload failed");
        }
      } catch (error) {
        console.error("PHP Upload Error:", error);
        return NextResponse.json(
          { message: "Image upload failed", error: error.message },
          { status: 500 }
        );
      }
    }







    // ✅ Update category
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        descriptionBelow,
        schemaHere, // ✅ Include schemaHere
        metaTitle,
        metaKeywords,
        metaDescription,
        remarks,
        status,
        image: imageUrl,
        public_id: publicId,
        faqs,
      },
      { new: true, runValidators: true },
    );

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// 📌 DELETE - Delete category
export async function DELETE(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    const category = await ProductCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    // Delete image from Cloudinary if exists
    // if (category.public_id) {
    //   try {
    //     await deleteFromCloudinary(category.public_id);
    //   } catch (error) {
    //     console.error("Failed to delete image:", error);
    //   }
    // }


// Delete image from local folder if exists
    if (category.public_id) {
      const filePath = path.join(process.cwd(), "public", "uploads", category.public_id);
      try {
        if (fs.existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error("Failed to delete local image:", error);
      }
    }



    await ProductCategory.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
