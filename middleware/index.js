/*
  Generate a router middleware and attach to it all
  routes which are defined in api.json file.
*/

const express = require("express")

const stdController = require("./stdController"),
      customControllers = require("./controllers"),
      validators = require("./validators");

const validateApiJson = (apiJson) => {
  // TODO
}

class ApiEndpoint {

  constructor(path, methodArray, validator) {
    this._path = path
    this._methods = methodArray
    this._validator = validator
  }

  get path() {
    return this._path
  }

  get methods() {

    let assignMethod = (m) => {

      const c = m.controller,
            methodObject = {
              httpReqMethod: m.type.toLowerCase()
            };

      if (c.standardController) {
        const stdCtrl = stdController(c.model)
        methodObject.controllerMethod = stdCtrl[c.method]
      } else {
        methodObject.controllerMethod = customCtrl[c.method]
      } return methodObject

    }

    return this._methods.map(assignMethod)

  }

  get validator() {
    return null
  }

}

module.exports = (apiJson) => {

  const mw = express.Router()

  let attachEndpoint = (route, endpoint) => endpoint.methods
    .forEach(e => route[e.httpReqMethod](e.controllerMethod))

  const apiEndpointObjects = apiJson.endpoints.map(e => {
    const endpoint = new ApiEndpoint(e.path, e.methods)
    attachEndpoint(mw.route(endpoint.path), endpoint)
  })

  return mw

}
