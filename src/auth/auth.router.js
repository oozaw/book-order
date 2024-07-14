import express from "express";
import authController from "./auth.controller.js";

const authRouter = new express.Router();

authRouter.post("/api/auth/register", authController.register);
authRouter.post("/api/auth/login", authController.login);

export {
   authRouter
}