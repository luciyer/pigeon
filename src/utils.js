const mongoose = require("mongoose")

const connectToDb = () => {

  const dbUri = process.env.MONGODB_URI || "mongodb://localhost/dev";

  const dbOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }

  mongoose.connect(dbUri, dbOptions)
    .then(console.log(`Connected to ${dbUri}.`))
    .catch(console.error)

}

exports.serverStarted = () => {
  connectToDb()
  console.log(`Server started.`)
}
