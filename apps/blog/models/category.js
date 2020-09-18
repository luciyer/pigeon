const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = categorySchema
