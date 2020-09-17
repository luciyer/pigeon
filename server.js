const express = require("express"),
      mongoose = require("mongoose");

const { birds } = require("./middleware");

const app = express(),
      db_uri = process.env.MONGODB_URI || "mongodb://localhost/dev";

mongoose.connect(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).catch(console.error)

app
  .use(express.json())
  .use("/api/birds", birds.middleware)
  .listen(process.env.PORT || 8080)
