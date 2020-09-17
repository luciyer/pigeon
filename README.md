# 🐦

### Simple POC for generating REST APIs from a JSON file

(Node, Express, Mongoose)

```
{
  "endpoints" : [
    {
      "path" : "/birds",
      "methods" : [
        {
          "type" : "GET",
          "controller" : {
            "standardController": true,
            "model": "Bird",
            "method": "retrieveDocuments"
          }
        },
        {
          "type" : "POST",
          "controller" : {
            "standardController": true,
            "model": "Bird",
            "method": "createDocument"
          }
        }
      ]
    },
    {
      "path" : "/birds/:id",
      "methods" : [
        {
          "type" : "GET",
          "controller" : {
            "standardController": true,
            "model": "Bird",
            "method": "readDocument"
          }
        }
      ]
    }
  ]
}

```
