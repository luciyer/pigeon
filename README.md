# Pigeon

### What's Pigeon?

🐦 Pigeon is a lightweight framework that sits on top of express, express-validator, and mongoose. Pigeon provides an easy way to bootstrap a REST API.

Drop in a mongoose schema (or write your own controllers), and you're off to the races.


```
$ git clone https://github.com/luciyer/pigeon.git
$ cd pigeon/
$ npm i -g
```
To generate an empty app:

```
$ pigeon-app hello
```

To generate an empty-ish middleware in `hello/config.json`:

```
$ pigeon-mw -a hello
```

To generate a middleware with a standard (mongoose) controller in `hello/config.json`:

```
$ pigeon-mw -a hello -m [model]
```

Default endpoints and methods look like this:

```javascript
{
  "/" : [
    { type: "GET", method: "retrieveDocuments" },
    { type: "POST", method: "createDocument" },
  ],
  "/count": [
    { type: "GET", method: "countDocuments" }
  ],
  "/:id": [
    { type: "GET", method: "retrieveDocument" },
    { type: "PATCH", method: "updateDocument" },
    { type: "DELETE", method: "deleteDocument" },
  ],
  "/:relation/:id": [
    { type: "GET", method: "retrieveSiblings" },
  ]
}
```

If you want to prefix (for multiple models, for example) those standard routes, you can do the following:

```
$ pigeon-mw -a hello -r [route] -m [model]
```

And you're routes will instead be

```
/[route]/
/[route]/count
/[route]/:id
/[route]/:relation/:id
```
