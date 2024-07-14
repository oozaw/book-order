import {prismaClient} from "../src/config/database.js";
import supertest from "supertest";
import {app} from "../src/config/app.js";
import {decodeToken} from "../src/app/utils/token.js";

const user = {
   name: "test_name",
   email: "test@email.com",
   password: "test_password",
};

describe("POST '/api/auth/register'", () => {
   const endpoint = "/api/auth/register";

   beforeEach(async () => {
      await prismaClient.user.deleteMany({
         where: {
            email: user.email
         }
      });
   });

   it("should successfully register a user", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send(user);

      console.log(result.body);

      expect(result.body.code).toBe(201);
      expect(result.body.data.name).toBe(user.name);
      expect(result.body.data.email).toBe(user.email);
      expect(result.body.data.token).not.toBeNull();
   });

   it("should error when email is already in use", async () => {
      await prismaClient.user.create({
         data: user
      });

      const result = await supertest(app)
         .post(endpoint)
         .send(user);

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors).toBe("Email already exists");
   });

   it("should error when email is invalid", async () => {
      const invalidEmail = "invalid_email";

      const result = await supertest(app)
         .post(endpoint)
         .send({
            ...user,
            email: invalidEmail
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("email");
   });

   it("should error when password is too short", async () => {
      const shortPassword = "short";

      const result = await supertest(app)
         .post(endpoint)
         .send({
            ...user,
            password: shortPassword
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("password");
   });

   it("should error when name is empty", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            ...user,
            name: ""
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("name");
   });

   it("should error when email is empty", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            ...user,
            email: ""
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("email");
   });

   it("should error when password is empty", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            ...user,
            password: ""
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("password");
   });

   it("should generate valid token", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send(user);

      console.log(result.body);

      const decodedToken = await decodeToken(result.body.data.token);

      expect(result.body.code).toBe(201);
      expect(result.body.data.token).not.toBeNull();
      expect(decodedToken.id).not.toBeNull();
      expect(decodedToken.name).toBe(user.name);
      expect(decodedToken.email).toBe(user.email);
   });
});

describe("POST '/api/auth/login'", () => {
   const endpoint = "/api/auth/login";

   beforeEach(async () => {
      await prismaClient.user.deleteMany({
         where: {
            email: user.email
         }
      });

      await supertest(app)
         .post("/api/auth/register")
         .send(user);
   });

   it("should successfully login a user", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            email: user.email,
            password: user.password
         });

      console.log(result.body);

      expect(result.body.code).toBe(200);
      expect(result.body.data.name).toBe(user.name);
      expect(result.body.data.email).toBe(user.email);
      expect(result.body.data.token).not.toBeNull();
   });

   it("should error when email is not found", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            email: "not_found@email.com",
            password: user.password
         });

      console.log(result.body);

      expect(result.body.code).toBe(401);
      expect(result.body.errors).toBe("Invalid email or password");
   });

   it("should error when email is invalid", async () => {
      const invalidEmail = "invalid_email";

      const result = await supertest(app)
         .post(endpoint)
         .send({
            email: invalidEmail,
            password: user.password
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("email");
   })

   it("should error when email and password is empty", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send({
            email: "",
            password: ""
         });

      console.log(result.body);

      expect(result.body.code).toBe(400);
      expect(result.body.errors[0].path).toBe("email");
      expect(result.body.errors[1].path).toBe("password");
   });

   it("should generate valid token", async () => {
      const result = await supertest(app)
         .post(endpoint)
         .send(
            {
               email: user.email,
               password: user.password
            }
         );

      console.log(result.body);

      const decodedToken = await decodeToken(result.body.data.token);

      expect(result.body.code).toBe(200);
      expect(result.body.data.token).not.toBeNull();
      expect(decodedToken.id).not.toBeNull();
      expect(decodedToken.name).toBe(user.name);
      expect(decodedToken.email).toBe(user.email);

   });
});