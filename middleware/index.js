/*
  Generate a router middleware and attach to it all
  routes which are defined in api.json file.
*/

const express = require("express")
const controllers = require("./controllers")

const validateApiJson = (apiJson) => {
  // TODO
}

module.exports = (apiJson) => {

  const mw = express.Router()

  apiJson.endpoints.forEach(e => {
    const route = mw.route(e.path)
    e.methods.forEach(m => {
      let controllerMethod;
      const c = m.controller, callMethod = m.type.toLowerCase();
      if (c.standardController) {
        const ctrl = controllers.stdController(c.model)
        controllerMethod = ctrl[c.method]
      } else {
        controllerMethod = controllers[c.method]
      }
      route[callMethod](controllerMethod)
    })
  })

  return mw

}
