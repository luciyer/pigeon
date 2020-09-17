const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

const middleware = require("./middleware"),
      api = require("./api");

const app = express(),
      db_uri = process.env.MONGODB_URI || "mongodb://localhost/dev";

mongoose.connect(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).catch(console.error)

app
  .use(bodyParser.json())
  .use("/api", middleware(api))
  .listen(process.env.PORT || 8080)
