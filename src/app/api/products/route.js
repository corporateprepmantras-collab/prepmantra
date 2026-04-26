import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Product from "@/models/productListSchema";
import {
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";
import Order from "@/models/orderSchema";
import { sendOrderUpdateEmail } from "@/lib/email/orderEmails";
import mongoose from "mongoose";
import { serializeMongoArray, serializeMongoDoc } from "@/lib/mongoHelpers";

// Define authUsers model
const authUserModel =
  mongoose.models.authUsers ||
  mongoose.model(
    "authUsers",
    new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        image: { type: String },
        emailVerified: { type: Date },
      },
      { collection: "authUsers" },
    ),
  );

// Helper to parse FormData
async function parseFormData(req) {
  const formData = await req.formData();
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) {
        data[key] = value;
        console.log(
          `✅ File added: ${key}, Size: ${value.size}, Name: ${value.name}`,
        );
      } else {
        console.log(`⚠️ File skipped (empty): ${key}`);
      }
    } else {
      if (key === "faqs") {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = [];
        }
      } else {
        data[key] = value;
      }
    }
  }

  return data;
}

// Handle file uploads
async function handleFileUploads(data, existingProduct = null) {
  const uploads = {};

  const fileConfig = {
    image: { handler: uploadImageToCloudinary, type: "image" },
    samplePdf: { handler: uploadPdfToCloudinary, type: "pdf" },
    mainPdf: { handler: uploadPdfToCloudinary, type: "pdf" },
  };

  for (const [field, config] of Object.entries(fileConfig)) {
    console.log(`\n🔍 Checking ${field}...`);

    if (data[field] && data[field].size > 0) {
      console.log(`📤 Uploading ${field} as ${config.type}...`);

      try {
        // Delete old file if exists
        if (existingProduct && existingProduct[`${field}Url`]) {
          const oldUrl = existingProduct[`${field}Url`];
          const publicId = oldUrl.split("/").pop().split(".")[0];
          console.log(`🗑️ Deleting old ${field}...`);
          await deleteFromCloudinary(publicId);
        }

        // Convert file to buffer
        const buffer = Buffer.from(await data[field].arrayBuffer());
        console.log(`📦 Buffer size: ${buffer.length} bytes`);

        // Upload using appropriate handler
        const result = await config.handler(buffer);
        uploads[`${field}Url`] = result.secure_url;

        console.log(`✅ ${field} uploaded successfully!`);
        console.log(`🔗 URL: ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Error uploading ${field}:`, error.message);
        throw new Error(`Failed to upload ${field}: ${error.message}`);
      }
    } else {
      console.log(`⏭️ Skipping ${field} - no file provided`);
    }

    delete data[field];
  }

  return uploads;
}

// ==================== OPTIMIZED GET METHOD ====================
export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const searchQuery = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit")) || 0;
    const sort = searchParams.get("sort");

    // GET SINGLE PRODUCT BY ID
    if (id) {
      const product = await Product.findById(id).lean();
      return NextResponse.json({ data: serializeMongoDoc(product) });
    }

    // SEARCH QUERY
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      const products = await Product.find({
        $or: [
          { title: { $regex: searchRegex } },
          { sapExamCode: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      }).lean();

      return NextResponse.json({
        data: serializeMongoArray(products),
        total: products.length,
      });
    }

    // ✅ POPULAR PRODUCTS WITH LIMIT & OPTIMIZED FIELDS
    if (limit > 0) {
      let sortObj = {};

      if (sort === "popular") {
        sortObj = { createdAt: -1 };
      } else {
        sortObj = { createdAt: -1 };
      }

      // ✅ Build filter: apply category filter if provided
      const categoryFilter = searchParams.get("category");
      const filter = categoryFilter
        ? { category: { $regex: new RegExp(`^${categoryFilter}$`, "i") } }
        : {};

      const products = await Product.find(filter)
        .sort(sortObj)
        .limit(limit)
        .select({
          _id: 1,
          title: 1,
          slug: 1,
          category: 1,
          sapExamCode: 1,
          imageUrl: 1,
          mainPdfUrl: 1,
          Description: 1,
          dumpsPriceInr: 1,
          dumpsPriceUsd: 1,
          dumpsMrpInr: 1,
          dumpsMrpUsd: 1,
          showWpConnect: 1,
        })
        .lean();

      console.log(`✅ Fetched ${products.length} products with limit ${limit}${categoryFilter ? ` (category: ${categoryFilter})` : ""}`);

      return NextResponse.json(
        {
          data: serializeMongoArray(products),
          total: products.length,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        },
      );
    }

    // DEFAULT: GET ALL PRODUCTS
    const products = await Product.find().lean();
    return NextResponse.json({
      data: serializeMongoArray(products),
      total: products.length,
    });
  } catch (error) {
    console.error("❌ /api/products GET error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// POST /api/products - Create new product
export async function POST(req) {
  try {
    console.log("\n🚀 POST /api/products - Creating new product");
    await connectMongoDB();

    const data = await parseFormData(req);

    // Handle file uploads
    const uploads = await handleFileUploads(data);

    const productData = { ...data, ...uploads, faqs: data.faqs || [] };
    // Coerce showWpConnect string → boolean
    if ("showWpConnect" in productData) {
      productData.showWpConnect = productData.showWpConnect === true || productData.showWpConnect === "true";
    }

    console.log("\n📝 Creating product with data...");
    const newProduct = new Product(productData);
    await newProduct.save();

    console.log("✅ Product created successfully!");
    console.log("📍 Product ID:", newProduct._id);

    return NextResponse.json(
      { message: "Product created successfully", data: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/products - Update existing product
export async function PUT(req) {
  try {
    console.log("\n🚀 PUT /api/products - Updating product");
    await connectMongoDB();

    const data = await parseFormData(req);
    const idFromQuery = new URL(req.url).searchParams.get("id");
    const id = idFromQuery || data._id;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    console.log("📍 Updating product:", id);

    // Handle file uploads
    const uploads = await handleFileUploads(data, existingProduct);

    const updateData = { ...data, ...uploads, faqs: data.faqs || [] };
    delete updateData._id;
    // Coerce showWpConnect string → boolean
    if ("showWpConnect" in updateData) {
      updateData.showWpConnect = updateData.showWpConnect === true || updateData.showWpConnect === "true";
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("✅ Product updated successfully!");

    // ============= CHECK FOR PDF CHANGES AND NOTIFY USERS =============
    console.log("\n📧 ========== PRODUCT UPDATE NOTIFICATION START ==========");
    console.log("🔍 Checking PDF changes...");
    console.log("Old mainPdfUrl:", existingProduct.mainPdfUrl);
    console.log("New mainPdfUrl:", updatedProduct.mainPdfUrl);
    console.log(
      "Changed?:",
      existingProduct.mainPdfUrl !== updatedProduct.mainPdfUrl,
    );

    if (
      existingProduct.mainPdfUrl !== updatedProduct.mainPdfUrl &&
      updatedProduct.mainPdfUrl
    ) {
      console.log("\n🔄 PDF URL changed! Finding affected orders...");

      try {
        const affectedOrders = await Order.find({
          "courseDetails.productId": id,
        });

        console.log(
          `📦 Found ${affectedOrders.length} orders with this product`,
        );

        // Send email to each user
        for (const order of affectedOrders) {
          try {
            const authUser = await authUserModel.findById(order.user);

            if (authUser) {
              console.log("📧 Sending update email to:", authUser.email);

              const pdfChanges = [
                {
                  courseName: updatedProduct.title || updatedProduct.name,
                  oldUrl: existingProduct.mainPdfUrl,
                  newUrl: updatedProduct.mainPdfUrl,
                },
              ];

              await sendOrderUpdateEmail({
                userEmail: authUser.email,
                userName: authUser.name || "Customer",
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                pdfChanges,
                expiryDate: order.expiryDate,
              });

              console.log("✅ Update email sent to:", authUser.email);
            }
          } catch (emailError) {
            console.error("❌ Failed to send email for order:", order._id);
            console.error("Error:", emailError.message);
          }
        }

        // Update courseDetails in all orders
        if (affectedOrders.length > 0) {
          await Order.updateMany(
            { "courseDetails.productId": id },
            {
              $set: {
                "courseDetails.$[elem].mainPdfUrl": updatedProduct.mainPdfUrl,
              },
            },
            {
              arrayFilters: [{ "elem.productId": id }],
            },
          );
          console.log(`✅ Updated PDF URL in ${affectedOrders.length} orders`);
        }
      } catch (notificationError) {
        console.error(
          "❌ Error sending notifications:",
          notificationError.message,
        );
      }
    }

    console.log("📧 ========== PRODUCT UPDATE NOTIFICATION END ==========\n");

    return NextResponse.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/products
export async function DELETE(req) {
  try {
    console.log("\n🚀 DELETE /api/products");
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Delete associated files
    const fileFields = ["imageUrl", "samplePdfUrl", "mainPdfUrl"];
    for (const field of fileFields) {
      if (product[field]) {
        const publicId = product[field].split("/").pop().split(".")[0];
        console.log(`🗑️ Deleting ${field}...`);
        await deleteFromCloudinary(publicId);
      }
    }

    await Product.findByIdAndDelete(id);
    console.log("✅ Product deleted successfully!");

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
