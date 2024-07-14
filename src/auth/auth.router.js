import express from "express";
import authController from "./auth.controller.js";

const authRouter = new express.Router();

/**
 * @swagger
 *   /api/auth/register:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Register a new user
 *       description: Register a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterRequest'
 *             examples:
 *               "User #1":
 *                 $ref: '#/components/examples/User'
 *       responses:
 *           201:
 *             $ref: '#/components/responses/AuthResponse'
 *             description: User registered successfully
 */
authRouter.post("/api/auth/register", authController.register);

/**
 * @swagger
 *   /api/auth/login:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Login authentication
 *       description: Login authentication for user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginRequest'
 *             example:
 *               email: johndoe@example.com
 *               password: example_password
 *       responses:
 *         '200':
 *           $ref: '#/components/responses/AuthResponse'
 */
authRouter.post("/api/auth/login", authController.login);

export {
   authRouter
}