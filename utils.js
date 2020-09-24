const mongoose = require("mongoose")

const connectToDb = () => {

  const dbUri = process.env.MONGODB_URI || "mongodb://localhost/dev";

  const dbOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }

  try {
    const mongooseConnection = mongoose.connect(dbUri, dbOptions)
    console.info(`Connected to to ${dbUri}.`)
    return mongooseConnection
  } catch (error) {
    return console.error(error)
  }

}

exports.serverStarted = async () => {
  await connectToDb()
  console.info(`Server started.`)
}

exports.logMiddlewares = (apps) => {
  Object.keys(apps).forEach(k => apps[k].log())
}
