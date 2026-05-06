const mongoose = require('mongoose');

const blogCategoryListSchema = new mongoose.Schema({
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory'
    }
  ]
});

// ✅ Prevent OverwriteModelError in Next.js dev environment
module.exports = mongoose.models.BlogCategoryList || mongoose.model('BlogCategoryList', blogCategoryListSchema);
