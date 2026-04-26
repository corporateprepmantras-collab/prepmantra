import mongoose from "mongoose";

const ContentSchema1 = new mongoose.Schema(
  {
    html: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Content1 || mongoose.model("Content1", ContentSchema1);
