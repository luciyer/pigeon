/*
  Generate a router middleware and attach to it all
  routes/methods which are defined in api.json file.
*/

const fs = require("fs"),
      path = require("path"),
      express = require("express");

const stdController = require("./stdController")

class Api {

  constructor (apiDirPath) {
    this._dirPath = apiDirPath
    this._defPath = path.join(apiDirPath, "api.json")
    this._defJson = JSON.parse(fs.readFileSync(this._defPath))
  }

  get name() {
    return this._defJson.meta.name
  }

  get controllers () {
    const { controllerDirectory } = this._defJson.meta,
          ctrlPath = path.resolve(this._dirPath, controllerDirectory);
    return require(ctrlPath)
  }

  get models () {
    const { modelDirectory } = this._defJson.meta,
          mdlPath = path.resolve(this._dirPath, modelDirectory);
    return require(mdlPath)
  }

  get validators () {
    const { validatorDirectory } = this._defJson.meta,
          vldPath = path.resolve(this._dirPath, validatorDirectory);
    return require(vldPath)
  }

  get methods() {

    const allMethods = {}, { endpoints } = this._defJson;

    endpoints.forEach(e => {

      const { path, methods } = e

      allMethods[path] = []

      methods.forEach(m => {

        const c = m.controller, methodObject = {
          httpReqMethod: m.type.toLowerCase()
        }

        if (c.standardController) {
          const model = this.models[c.model], stdCtrl = stdController(model);
          methodObject.controllerMethod = stdCtrl[c.method]
        } else {
          methodObject.controllerMethod = this.controllers[c.method]
        }

        if (m.validator)
          methodObject.validator = this.validators[m.validator]

        allMethods[path].push(methodObject)

      });

    });

    return allMethods

  }

  get middleware () {

    const router = express.Router()

    Object.entries(this.methods).forEach(([path, methodList]) => {

      const route = router.route(path)

      methodList.forEach(m => {
        if (m.validator)
          route[m.httpReqMethod](m.validator, m.controllerMethod)
        else
          route[m.httpReqMethod](m.controllerMethod)
      });

    });

    return router

  }

}

const initializeApis = () => {

  const apiListing = {}

  const middlewareDirectory = path.resolve(__dirname),
        directoryContents = fs.readdirSync(middlewareDirectory);

  let createApiObject = (apiDirectory) => {
    const apiDirectoryPath = path.join(middlewareDirectory, apiDirectory)
    return new Api(apiDirectoryPath)
  }

  const apiDirectories = directoryContents.filter(item => {
    const itemPath = path.join(middlewareDirectory, item)
    return fs.statSync(itemPath).isDirectory()
  });

  apiDirectories.forEach(d => {
    const api = createApiObject(d)
    apiListing[api.name] = api
  });

  return apiListing

}

module.exports = initializeApis()
