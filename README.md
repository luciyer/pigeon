# Pigeon

### What's Pigeon?

🐦 Pigeon is a lightweight framework that sits on top of express, express-validator, and mongoose. Pigeon provides an easy way to bootstrap a REST API.

Drop in a mongoose schema (or write your own controllers), and you're off to the races.


```
$ git clone https://github.com/luciyer/pigeon.git
$ cd pigeon/
$ npm i -g
```

### Apps

To generate an app named "hello":

```
$ pigeon-app hello
```

Will create

```
apps/  
  hello/
    controllers/
      index.js
    models/
      index.js
    validators/
      index.js
    config.json
```

### Middlewares

To generate a middleware in `hello/config.json`:

```
$ pigeon-mw -a hello [-r route_prefix] [-m model_name]
```

#### Standard Controller

If you **include** a model (`-m SomeModelName`), it will attach standard controller methods and set default endpoints and methods that look like this:

`hello/config.js`
```json
"endpoints": [
  {
    "path" : "/",
    "methods" : [
      {
        "type" : "GET",
        "controller" : {
          "standardController": true,
          "model": "SomeModelName",
          "method": "retrieveDocuments"
        },
        "validator": ""
      },
      ...
    ]
  },
  ...
]
```

You can edit standard controller behavior in `src/standardController.js`, but it's not recommended.

#### Custom Controllers

If you **exclude** `-m`, you'll have to define your own methods and export them in `hello/controllers/index.js`, then reference them in `hello/config.json`.

`hello/config.js`
```json
"endpoints": [
  {
    "path" : "/",
    "methods" : [
      {
        "type" : "GET",
        "controller" : {
          "standardController": false,
          "method": "myCustomControllerMethod"
        },
        "validator": ""
      },
      ...
    ]
  },
  ...
]
```


### Route Prefixes

Including `-r`, you can prefix those routes:

```
/[route]/
/[route]/count
/[route]/:id
/[route]/:relation/:id
```

### Validation

Export from `hello/validators/index.js`, using express-validator format an array that looks like `[ [validation], reporterFunction ]`. In `hello/config.json`, find the relevant method and set (for example) `"validator": "idValidator"`.

Here's an example:

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

`hello/config.js`
```json
"endpoints": [
  ...
  {
    "path" : "/:id",
    "methods" : [
      {
        "type" : "GET",
        "controller" : {
          "standardController": false,
          "method": "myCustomControllerMethod"
        },
        "validator": "idValidator"
      },
      ...
    ]
  },
  ...
]
```
