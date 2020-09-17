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

  constructor(endpointJson) {

    if (!this.valid(endpointJson))
      throw Error(`Invalid JSON structure. Skipping.`)

    this._path = endpointJson.path
    this._methods = endpointJson.methods
    this._validator = endpointJson.validator

  }

  valid (json) {
    // Validate Endpoint JSON here
    return true
  }

  get path() {
    return this._path
  }

  get methods() {

    let assignMethod = (m) => {

      const c = m.controller,
            methodObject = {
              httpReqMethod: m.type.toLowerCase(),
            };

      if (c.standardController) {
        const stdCtrl = stdController(c.model)
        methodObject.controllerMethod = stdCtrl[c.method]
      } else {
        methodObject.controllerMethod = customControllers[c.method]
      }

      if (m.validator)
        methodObject.validator = validators[m.validator]

      return methodObject

    }

    return this._methods.map(assignMethod)

  }

}

module.exports = (apiJson) => {

  const mw = express.Router()

  let attachEndpoint = (route, endpoint) => endpoint.methods
    .forEach(e => {
      if (e.validator) {
        route[e.httpReqMethod](e.validator, e.controllerMethod)
      }
      else {
        route[e.httpReqMethod](e.controllerMethod)
      }
    })

  const apiEndpointObjects = apiJson.endpoints.map(e => {
    const endpoint = new ApiEndpoint(e), route = mw.route(endpoint.path);
    attachEndpoint(route, endpoint)
  })

  return mw

}
