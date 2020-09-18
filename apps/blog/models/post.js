const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: String,
  text: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  tags: [ String ],
  published: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true })

module.exports = postSchema
