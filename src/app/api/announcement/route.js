import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Announcement from "@/models/announcementSchema";
import { uploadToCloudinaryBlog } from "@/lib/cloudinary";

// ✅ GET → fetch announcement
export async function GET() {
  try {
    await connectMongoDB();
    let announcement = await Announcement.findOne();
    if (!announcement) {
      announcement = await Announcement.create({});
    }
    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST → create new announcement (if none exists)
export async function POST(request) {
  try {
    await connectMongoDB();

    const formData = await request.formData();
    const active = formData.get("active") === "true";
    const delay = parseFloat(formData.get("delay")) || 2.0;
    const image = formData.get("image");

    let imageUrl = "";
    let imagePublicId = "";

    // if (image && typeof image === "object") {
    //   const uploadResult = await uploadToCloudinaryBlog(image);
    //   imageUrl = uploadResult.secure_url;
    //   imagePublicId = uploadResult.public_id;
    // }



    if (image && typeof image === "object" && image.size > 0) {
      const phpFormData = new FormData();
      phpFormData.append("image", image);

      try {
        const phpResponse = await fetch("https://examdumps360.com/prepmantra/upload.php", {
          method: "POST",
          body: phpFormData,
        });

        const uploadResult = await phpResponse.json();

        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          imagePublicId = uploadResult.filename;
        } else {
          throw new Error(uploadResult.error || "PHP upload failed");
        }
      } catch (error) {
        console.error("PHP Upload Error:", error);
        return NextResponse.json({ error: "Image upload failed: " + error.message }, { status: 500 });
      }
    }



    const announcement = new Announcement({
      active,
      delay,
      imageUrl,
      imagePublicId,
    });

    await announcement.save();

    return NextResponse.json(
      { message: "Created successfully", data: announcement },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT → update announcement
export async function PUT(request) {
  try {
    await connectMongoDB();

    const formData = await request.formData();
    const active = formData.get("active") === "true";
    const delay = parseFloat(formData.get("delay")) || 2.0;
    const image = formData.get("image");

    let announcement = await Announcement.findOne();
    if (!announcement) {
      return NextResponse.json(
        { error: "No announcement found. Create one first." },
        { status: 404 }
      );
    }

    // if (image && typeof image === "object") {
    //   const uploadResult = await uploadToCloudinaryBlog(image);
    //   announcement.imageUrl = uploadResult.secure_url;
    //   announcement.imagePublicId = uploadResult.public_id;
    // }



    if (image && typeof image === "object" && image.size > 0) {
      const phpFormData = new FormData();
      phpFormData.append("image", image);

      try {
        const phpResponse = await fetch("https://examdumps360.com/prepmantra/upload.php", {
          method: "POST",
          body: phpFormData,
        });

        const uploadResult = await phpResponse.json();

        if (uploadResult.success) {
          announcement.imageUrl = uploadResult.url;
          announcement.imagePublicId = uploadResult.filename;
        } else {
          throw new Error(uploadResult.error || "PHP upload failed");
        }
      } catch (error) {
        console.error("PHP Upload Error:", error);
        return NextResponse.json({ error: "Image upload failed: " + error.message }, { status: 500 });
      }
    }

    

    announcement.active = active;
    announcement.delay = delay;

    await announcement.save();

    return NextResponse.json({
      message: "Updated successfully",
      data: announcement,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
