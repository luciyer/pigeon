const { check, validationResult } = require("express-validator")

const myValidator = []

const reporterMiddleware = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })
    next();
}

const addValidator = (validationArray) => {
  return [
    validationArray,
    reporterMiddleware
  ]
}

module.exports = {}
