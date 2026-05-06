import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  url: { type: String, required: true },
});

// Prevent model overwrite on hot reload
export default mongoose.models.SocialLink || mongoose.model("SocialLink", socialLinkSchema);
