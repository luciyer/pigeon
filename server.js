const express = require("express"),
      mongoose = require("mongoose");

const Pigeon = require("./src"),
      utils = require("./src/utils");

const app = express();

app
  .use(express.json())
  .listen(8080, utils.serverStarted)

/*

After generating an app, you can assign its middleware like so:

const blog = new Pigeon("./apps/blog")
app.use("/api/blog", blog.middleware)

*/
