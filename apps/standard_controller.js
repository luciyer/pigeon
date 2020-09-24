module.exports = class {

  constructor(Model) {
    this.Model = Model
  }

  get dbMethods() {

    const getDocs = () => {
      return this.Model.find()
    }

    const countDocs = () => {
      return this.Model.estimatedDocumentCount().exec()
    }

    const getSiblings = (relation, id) => {
      const query = {}
      query[relation] = id
      return this.Model.find(query)
    }

    const createDoc = (body) => {
      const doc = new this.Model(body)
      return doc.save()
    }

    const readDoc = (id) => {
      return this.Model.findById(id)
    }

    const updateDoc = (id, body) => {
      return this.Model.findByIdAndUpdate(id, body, { new: true }).exec();
    }

    const deleteDoc = (id) => {
      return this.Model.findByIdAndDelete(id).exec()
    }

    return {
      getDocs,
      countDocs,
      getSiblings,
      createDoc,
      readDoc,
      updateDoc,
      deleteDoc
    }

  }

  get requestHandlers() {

    let handleSuccess = (res, result) => {
      return res.status(200).json(result)
    }

    let handleError = (res, error) => {
      console.error(error.message)
      return res.status(500).json({ error: error.message })
    }

    const retrieveDocuments = async (req, res) => {
      this.dbMethods.getDocs()
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const countDocuments = (req, res) => {
      this.dbMethods.countDocs()
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const retrieveSiblings = (req, res) => {
      const { relation, id } = req.params
      this.dbMethods.getSiblings(relation, id)
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const createDocument = (req, res) => {
      this.dbMethods.createDoc(req.body)
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const readDocument = async (req, res) => {
      this.dbMethods.readDoc(req.params.id)
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const updateDocument = async (req, res) => {
      this.dbMethods.updateDoc(req.params.id, req.body)
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    const deleteDocument = async (req, res) => {
      this.dbMethods.deleteDoc(req.params.id)
        .then(result => handleSuccess(res, result))
        .catch(error => handleError(res, error))
    }

    return {
      retrieveDocuments,
      countDocuments,
      retrieveSiblings,
      createDocument,
      readDocument,
      updateDocument,
      deleteDocument
    }

  }

}
