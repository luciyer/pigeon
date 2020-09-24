const express = require("express")

const apps = require("./apps"),
      utils = require("./utils");

const app = express()

// See routes/methods/controllers/validators for created apps
utils.logMiddlewares(apps)

app
  .use(express.json())
  .use("/api/birds", apps.birds.router)
  .listen(8080, utils.serverStarted)
