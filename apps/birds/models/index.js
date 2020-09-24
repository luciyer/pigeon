const mongoose = require("mongoose")

module.exports = {
  Bird: mongoose.model("Bird", require("./bird"))
}
