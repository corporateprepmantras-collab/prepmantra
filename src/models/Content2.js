import mongoose from "mongoose";

const ContentSchema2 = new mongoose.Schema(
  {
    html: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Content2 || mongoose.model("Content2", ContentSchema2);
