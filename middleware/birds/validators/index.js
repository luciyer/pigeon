const { check, validationResult } = require("express-validator")

const helloValidator = [
  check("name")
    .equals("luc")
    .withMessage("You can only say hello to luc, sorry.")
]

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

module.exports = {
  helloValidator: addValidator(helloValidator)
}
