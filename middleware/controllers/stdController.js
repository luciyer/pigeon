const { validationResult } = require("express-validator")

const Models = require("../../models")

const generateController = (modelName) => {

  if (!Models[modelName])
    throw Error(`Can not find model \"${modelName}\"`)

  const Model = Models[modelName]

  this.retrieveDocuments = async (req, res) => {
    try {
      const result = await Model.find({})
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  this.countDocuments = async (req, res) => {
    try {
      const result = await Model.estimatedDocumentCount().exec()
      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).json(error)
    }
  }

  this.retrieveSiblings = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

    try {
      const { relation, id } = req.params, query = {};
      query[relation] = id
      const result = await Model.find(query)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }


  }

  this.createDocument = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

    try {
      const doc = new Model(req.body),
            result = await doc.save();
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }

  }

  this.readDocument = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

    try {
      const id = req.params.id,
            result = await Model.findById(id);
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }

  }

  this.updateDocument = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

    try {
      const id = req.params.id,
            update = req.body,
            options = { new: true },
            result = await Model.findByIdAndUpdate(id, update, options).exec();
      return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json(error)
    }

  }

  this.deleteDocument = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

    try {
      const id = req.params.id,
            result = await Model.findByIdAndDelete(id).exec();
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json(error)
    }

  }

  return this

}

module.exports = generateController
