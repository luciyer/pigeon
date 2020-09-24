# 🐦 

### What's Pigeon?

Pigeon is a lightweight framework that sits on top of express, express-validator, and mongoose. Pigeon provides an easy way to bootstrap a REST API.


```
$ git clone https://github.com/luciyer/pigeon.git
$ cd pigeon/
$ npm i -g
```

### Zero to API

This repo comes with an app called `birds`. Here's how I created that in about 30 seconds:

#### Step 1. Generate an App

```
$ pigeon-app birds
```

This will create a folder inside of `apps/` called `birds/` with some scaffolding.

#### Step 2. Write Schemas (Optional)

Create a new model inside `apps/birds/models`.

```
$ touch apps/birds/models/bird.js
```

Write your mongoose schema there, and export it, then export the model...

`apps/birds/models/index.js`
```javascript
const mongoose = require("mongoose")
module.exports = {
  Bird: mongoose.model("Bird", require("./bird"))
}
```

_Note: I like my schemas in separate files. But this is up to you. You can write and export all your models directly from `index.js` if it floats your boat._

#### Step 3. Generate a Middleware Configuration

```
$ pigeon-mw -a birds -m Bird
```

Optionally, adding `-r [route_prefix]` to the above command, you can prefix the standard routes, ie.

```
/[route_prefix]/
/[route_prefix]/count
/[route_prefix]/query
/[route_prefix]/:id
```

Within `apps/birds/config.json` we've now created a mapping of paths, methods, and validators.

#### Step 4. Export Middleware(s)

`apps/index.js`

```javascript
// [...]
const getAppList = () => {
  return [ "birds" ] // and any other apps you made
}
// [...]
```

#### Step 5. Attach Middleware

`server.js`
```javascript
// [...]
app
  .use(express.json())
  .use("/api/birds", apps.birds.router) // <-- Adding this here!
  .listen(8080, utils.serverStarted)
```

All done.. Yay!

### Make it Flexible

You can add custom controllers and custom validators within `apps/[app_name]/controllers` and `apps/[app_name]/validators`, and then within `apps/[app_name]/config.json` reference those controllers or validators with the associated path(s).

Example: Adding a validator to `/api/birds/:id` to make sure that the ID is a valid mongoDB ObjectId

`birds/validators/index.js`
```javascript
const { check, validationResult } = require("express-validator")

const idValidator = [
  check("id")
    .isMongoId()
    .withMessage("Please provide a valid id.")
]

const reportErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })
    next();
}

module.exports = {
  idValidator: [ idValidator, reportErrors ]
}

```

`birds/config.json` (the relevant part...)
```json
{
  "path" : "/:id",
  "methods" : [
    {
      "type": "GET",
      "controller": {
        "standardController": true,
        "model": "Bird",
        "method": "readDocument"
      },
      "validator": "idValidator"
    }
  ]
}
```

Now requests to that path will be validated according to the `idValidator` function.

Example: Adding a custom controller to `/api/birds/hello`

`birds/controllers/index.js`
```javascript

const sayHello = (req, res) => {
  res.status(200).json({ message: "Hello!" })
}

module.exports = {
  sayHello: sayHello
}
```

`birds/config.json`
```json
{
  "path" : "/hello",
  "methods" : [
    {
      "type" : "GET",
      "controller" : {
        "standardController": false,
        "method": "sayHello"
      },
      "validator": ""
    }
  ]
}
```
