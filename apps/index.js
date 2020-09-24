const Middleware = require("./middleware")

const getAppList = () => {
  return [ "birds" ] 
}

const generateMiddlewares = () => {

  const appList = getAppList(), middlewares = {};

  appList.forEach(app => {
    const appMw = new Middleware(app)
    middlewares[appMw.name] = appMw
  })

  return middlewares

}

module.exports = generateMiddlewares()
