
const helloController = (req, res) => {
  console.log(`Hello ${req.params.name}`)
  res.sendStatus(200)
}

module.exports = {
  helloController: helloController
}
