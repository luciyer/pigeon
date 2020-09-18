const mongoose = require("mongoose")

module.exports = {
  Category: mongoose.model("Category", require("./category")),
  Post: mongoose.model("Post", require("./post"))
}
