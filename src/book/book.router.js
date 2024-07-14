import express from "express";
import bookController from "./book.controller.js";
import {verifyToken} from "../app/middelware/token.middleware.js";

const bookRouter = new express.Router();

bookRouter.post("/api/books", verifyToken, bookController.createBook);
bookRouter.get("/api/books/detail/:id" , verifyToken, bookController.getBook);
bookRouter.get("/api/books" , verifyToken, bookController.getListBooks);
bookRouter.get("/api/books/available", verifyToken, bookController.getAvailableBooks);
bookRouter.delete("/api/books/:id", verifyToken, bookController.removeBook);

export {
   bookRouter
}