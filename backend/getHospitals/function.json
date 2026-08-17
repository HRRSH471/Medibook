{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    },
    {
      "type": "cosmosDB",
      "name": "hospitals",
      "databaseName": "MediBook",
      "containerName": "doctors",
      "connection": "COSMOS_CONNECTION_STRING",
      "sqlQuery": "SELECT DISTINCT c.hospitalId, c.hospitalName FROM c",
      "direction": "in"
    }
  ]
}