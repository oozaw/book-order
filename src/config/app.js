import express from "express";
import {swagger} from "../../lib/swagger/swagger.js";
import {authRouter} from "../auth/auth.router.js";
import {errorMiddleware} from "../app/middelware/error.middleware.js";
import {bookRouter} from "../book/book.router.js";


export const app = express();

app.use(express.json());

// swagger
swagger(app);

// router
app.use(authRouter);
app.use(bookRouter);

// middleware
app.use(errorMiddleware);

