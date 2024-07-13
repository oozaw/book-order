import swaggerUi from "swagger-ui-express";
import swaggerDocs from "swagger-jsdoc";

export const swagger = (app) => {
   const swaggerSpec = swaggerDocs({
      definition: {
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
      },
      apis: ["./src/routes/*.js"],
   });

   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};