import swaggerUi from "swagger-ui-express";
import swaggerDocs from "swagger-jsdoc";

export const swagger = (app) => {
   const swaggerSpec = swaggerDocs({
      swaggerDefinition: {
         openapi: "3.0.0",
         info: {
            title: "Book Order API",
            version: "1.0.0",
            description: "API for ordering books with Express",
         },
         servers: [
            {
               url: "http://localhost:3000",
            },
         ],
         components: {
            securitySchemes: {
               ApiKeyAuth: {
                  description: "Authentication token for RESTful Theatre+ api",
                  type: "apiKey",
                  in: "header",
                  name: "X-API-KEY"
               }
            },
            "parameters": {
               "UserId": {
                  "name": "userId",
                  "description": "Id that represent specific user",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "minLength": 1
                  },
                  "examples": {
                     "User #1": {
                        "value": 1
                     },
                     "User #2": {
                        "value": 2
                     }
                  }
               }
            },
            "schemas": {
               "SuccessResponse": {
                  "type": "object",
                  "properties": {
                     "code": {
                        "type": "integer"
                     },
                     "status": {
                        "type": "string"
                     },
                     "data": {
                        "type": "object"
                     }
                  }
               },
               "SuccessArrayResponse": {
                  "type": "object",
                  "properties": {
                     "code": {
                        "type": "integer"
                     },
                     "status": {
                        "type": "string"
                     },
                     "data": {
                        "type": "array"
                     }
                  }
               },
               "RegisterRequest": {
                  "type": "object",
                  "properties": {
                     "name": {
                        "type": "string",
                        "required": true,
                        "minLength": 1
                     },
                     "email": {
                        "type": "string",
                        "required": true,
                        "minLength": 1
                     },
                     "password": {
                        "type": "string",
                        "required": true,
                        "minLength": 6
                     }
                  }
               },
               "LoginRequest": {
                  "type": "object",
                  "properties": {
                     "email": {
                        "type": "string",
                        "required": true,
                        "minLength": 1
                     },
                     "password": {
                        "type": "string",
                        "required": true,
                        "minLength": 6
                     }
                  }
               },
               "User": {
                  "type": "object",
                  "properties": {
                     "id": {
                        "type": "integer"
                     },
                     "nama": {
                        "type": "string"
                     },
                     "email": {
                        "type": "string"
                     },
                  }
               }
            },
            "responses": {
               "AuthResponse": {
                  "description": "Successfully authenticated",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/SuccessResponse"
                        },
                        "example": {
                           "code": 200,
                           "status": "OK",
                           "data": {
                              "token": "eySoihfdsaf340ihni2oknoda",
                              "id": 1,
                              "name": "John Doe",
                              "email": "johdndoe@example.com",
                              "createdAt": "2021-01-01T00:00:00Z",
                              "updatedAt": "2021-01-01T00:00:00Z"
                           }
                        }
                     }
                  }
               }
            },
            "examples": {
               "User": {
                  "description": "Example of user req body",
                  "value": {
                     "name": "John Doe",
                     "email": "johndoe@example.com",
                     "password": "example_password"
                  }
               },
               "200UserResponse": {
                  "value": {
                     "code": 200,
                     "status": "OK",
                     "data": [
                        {
                           "id": 1,
                           "name": "John Doe",
                           "email": "johdndoe@example.com",
                           "createdAt": "2021-01-01T00:00:00Z",
                           "updatedAt": "2021-01-01T00:00:00Z"
                        }
                     ]
                  }
               }
            }
         }
      },
      apis: [
         "./src/auth/*.js",
         "./src/user/*.js",
         "./src/book/*.js",
         "./src/member/*.js",
      ],
   });

   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};