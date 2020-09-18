const fs = require("fs"),
      path = require("path"),
      express = require("express"),
    { checkSchema } = require('express-validator');

const stdController = require("./standardController")

class Pigeon {

  constructor (apiDirPath) {
    this._dirPath = apiDirPath
    this._cfgPath = path.join(apiDirPath, "config.json")
    this._cfgJson = JSON.parse(fs.readFileSync(this._cfgPath))
  }

  get name() {
    return this._cfgJson.meta.name
  }

  get controllers () {
    const { controllerDirectory } = this._cfgJson.meta,
          ctrlPath = path.resolve(this._dirPath, controllerDirectory);
    return require(ctrlPath)
  }

  get models () {
    const { modelDirectory } = this._cfgJson.meta,
          mdlPath = path.resolve(this._dirPath, modelDirectory);
    return require(mdlPath)
  }

  get validators () {
    const { validatorDirectory } = this._cfgJson.meta,
          vldPath = path.resolve(this._dirPath, validatorDirectory);
    return require(vldPath)
  }

  get methods() {

    const allMethods = {}, { endpoints } = this._cfgJson;

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

module.exports = Pigeon
