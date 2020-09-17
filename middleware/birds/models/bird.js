const mongoose = require("mongoose")

const birdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  coolness: Number
}, { timestamps: true })

module.exports = birdSchema
