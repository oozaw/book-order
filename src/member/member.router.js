import express from "express";
import memberController from "./member.controller.js";
import {verifyToken} from "../app/middelware/token.middleware.js";

const memberRouter = express.Router();

memberRouter.get("/api/members", verifyToken, memberController.getListMembers);
memberRouter.post("/api/members/:id/borrow", verifyToken, memberController.borrowBook);
memberRouter.post("/api/members/:id/return", verifyToken, memberController.returnBook);

export {
   memberRouter
};