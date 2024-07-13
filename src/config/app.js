import express from "express";
import {swagger} from "../../lib/swagger/swagger.js";

export const app = express();

app.use(express.json());

// swagger
swagger(app);