# Pigeon

### What's Pigeon?

🐦 Pigeon is a lightweight tool for generating a REST API using mongoose, express, and express-validator.

### Assumptions

It's important to define what this tool does and does not facilitate.

I assume that developers who use pigeon are comfortable writing mongoose schemas, if their project calls for it.

I also assume that they will understand how to extend the tooling by writing their own custom controllers and validation if they please.

### How does it work?

Nearly everything you need to understand resides in `middleware/index.js`.

You can see in this repo the following structure:

```
middleware/
  birds/
    controllers/
    models/
    validators/
    api.json
  index.js
  stdController.js
```

`middleware/index.js` does two very simple but critical tasks. It finds all the folders within `middleware/`, and it parses their contents creating an instance of the `Api` object, ie.

```javascript
const birdsApi = new Api(path_to_birds_directory)
```

This instance of the `Api` object will hold unite all of the controller functions, models, validators, and methods it finds in the `api.json` file. It will generate an instance of `express.Router()` which we can use as a middleware.

Now that we have an `Api` object which holds all of the necessary pieces of our API, we can use it like so...

```javascript
/* server.js */

[...]

const { birds } = require("./middleware")

const app = express()

app
  .use("/api/birds", birds.middleware)

```
