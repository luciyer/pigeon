const fs = require("fs"),
      path = require("path"),
      express = require("express");

const StandardController = require("./standard_controller")

class Middleware {

  constructor (dirName) {
    this._dirPath = `./${dirName}`
    this._cfgRelPath = path.join(this._dirPath, "config.json")
    this._cfgAbsPath = path.resolve(__dirname, this._dirPath, "config.json")
    this._cfgJson = JSON.parse(fs.readFileSync(this._cfgAbsPath))
  }

  get name() {
    return this._cfgJson.meta.name
  }

  get controllers () {
    const { controllerDirectory } = this._cfgJson.meta,
          ctrlPath = path.resolve(__dirname, this._dirPath, controllerDirectory);
    return require(ctrlPath)
  }

  get models () {
    const { modelDirectory } = this._cfgJson.meta,
          mdlPath = path.resolve(__dirname, this._dirPath, modelDirectory);
    return require(mdlPath)
  }

  get validators () {
    const { validatorDirectory } = this._cfgJson.meta,
          vldPath = path.resolve(__dirname, this._dirPath, validatorDirectory);
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
          const model = this.models[c.model], stdCtrl = new StandardController(model).requestHandlers;
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

  get router () {

    const router = express.Router()

    Object.entries(this.methods).forEach(([path, methodList]) => {

      const route = router.route(path)

      methodList.forEach(m => {
        if (m.validator && m.validator !== "")
          route[m.httpReqMethod](m.validator, m.controllerMethod)
        else
          route[m.httpReqMethod](m.controllerMethod)
      });

    });

    return router

  }

  log() {

    const { endpoints } = this._cfgJson

    console.log("\n")
    console.log(`\"${this.name}\" middleware:\n`)

    endpoints.forEach(({path, methods}) => {
      methods.forEach(m => {
        const c = m.controller
        const ctrlString = c.standardController
          ? `[standard: ${c.model}.${c.method}]`
          : `[custom: ${c.method}]`;
        const validatorString = m.validator
          ? `[validator: ${m.validator}]`
          : ``;
        console.log(
          "\t",
          `${m.type.toUpperCase()} \"${path}\":`,
          ctrlString,
          validatorString
        )
      })
    })

    console.log("\n")

  }

}

module.exports = Middleware
