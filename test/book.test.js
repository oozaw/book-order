import {prismaClient} from "../src/config/database.js";
import supertest from "supertest";
import {app} from "../src/config/app.js";

let user = {
   name: "test_name",
   email: "test@email.com",
   password: "test_password",
}

let books = [
   {
      code: "B001",
      title: "Book #1",
      author: "Author #1",
      status: "AVAILABLE"
   },
   {
      code: "B002",
      title: "Book #2",
      author: "Author #2",
      status: "AVAILABLE"
   },
   {
      code: "B003",
      title: "Book #3",
      author: "Author #3",
      status: "BORROWED"
   },
   {
      code: "B004",
      title: "Book #4",
      author: "Author #4",
      status: "BORROWED"
   }
]

beforeAll(async () => {
   await prismaClient.book.deleteMany();
   await prismaClient.user.deleteMany({
      where: {
         email: user.email
      }
   });

   const result = await supertest(app)
      .post("/api/auth/register")
      .send(user);

   user = result.body.data;

   let createdBooks = [];

   for (const book of books) {
      const createdBook = await prismaClient.book.create({
         data: book
      });

      createdBooks.push(createdBook);
   }

   books = createdBooks;
});

describe("GET /api/books", () => {
   const endpoint = "/api/books";

   it("should return list of books", async () => {
      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data).toBeInstanceOf(Array);
      expect(result.body.data).toHaveLength(4);
   });

   it("should unauthorized when token is not provided", async () => {
      const result = await supertest(app)
         .get(endpoint);

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return unauthorized when token is invalid", async () => {
      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer invalid_token`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return 404 when book is empty", async () => {
      await prismaClient.book.deleteMany();

      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(404)
   });
});

describe("GET /api/books/available", () => {
   const endpoint = "/api/books/available";

   it("should return list of available books", async () => {
      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data).toBeInstanceOf(Array);
      expect(result.body.data).toHaveLength(2);
   });

   it("should unauthorized when token is not provided", async () => {
      const result = await supertest(app)
         .get(endpoint)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return unauthorized when token is invalid", async () => {
      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer invalid_token`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return 404 when book is empty", async () => {
      await prismaClient.book.deleteMany();

      const result = await supertest(app)
         .get(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(404)
   });
});

describe("GET /api/books/detail/:id", () => {
   const endpoint = "/api/books/detail";

   it("should return a book", async () => {
      const book = books[0];

      const result = await supertest(app)
         .get(`${endpoint}/${book.id}`)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data).not.toBeNull();
      expect(result.body.data.id).toBe(book.id);
      expect(result.body.data.code).toBe(book.code);
   });

   it("should return 404 when book is not found", async () => {
      const result = await supertest(app)
         .get(`${endpoint}/0000`)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(404);
   });

   it("should unauthorized when token is not provided", async () => {
      const result = await supertest(app)
         .get(`${endpoint}/1`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return unauthorized when token is invalid", async () => {
      const result = await supertest(app)
         .get(`${endpoint}/2`)
         .set("Authorization", `Bearer invalid_token`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return 404 when book is empty", async () => {
      await prismaClient.book.deleteMany();

      const result = await supertest(app)
         .get(`${endpoint}/2`)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(404)
   });
});

describe("POST /api/books", () => {
   const endpoint = "/api/books";

   it("should create a book", async () => {
      const data = {
         code: "B005",
         title: "Book #5",
         author: "Author #5",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(201);
      expect(result.body.data).not.toBeNull();
      expect(result.body.data.code).toBe(data.code);
   });

   it("should return 400 when book already exists", async () => {
      const data = {
         code: "B001",
         title: "Book #1",
         author: "Autthor #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(400);
   });

   it("should return 400 when code is empty", async () => {
      const data = {
         title: "Book #1",
         author: "Autthor #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(400);
   });

   it("should return 400 when title is empty", async () => {
      const data = {
         code: "B001",
         author: "Autthor #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(400);
   });

   it("should return 400 when author is empty", async () => {
      const data = {
         code: "B001",
         title: "Book #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer ${user.token}`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(400);
   });

   it("shoudl return 401 when token is not provided", async () => {
      const data = {
         code: "B001",
         title: "Book #1",
         author: "Autthor #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("shoudl return 401 when token is not valid", async () => {
      const data = {
         code: "B001",
         title: "Book #1",
         author: "Autthor #1",
         status: "AVAILABLE"
      };

      const result = await supertest(app)
         .post(endpoint)
         .set("Authorization", `Bearer invalid_token`)
         .send(data);

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });
});

describe("DELETE /api/books/:id", () => {
   const endpoint = "/api/books";

   it("should delete a book", async () => {
      const book = books[0];

      console.log(book);

      const result = await supertest(app)
         .delete(`${endpoint}/${book.id}`)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(200);

      const deletedBook = await prismaClient.book.findUnique({
         where: {
            id: book.id
         }
      });

      expect(deletedBook).toBeNull();
   });

   it("should return 404 when book is not found", async () => {
      const result = await supertest(app)
         .delete(`${endpoint}/0000`)
         .set("Authorization", `Bearer ${user.token}`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(404);
   });

   it("should unauthorized when token is not provided", async () => {
      const result = await supertest(app)
         .delete(`${endpoint}/1`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return unauthorized when token is invalid", async () => {
      const result = await supertest(app)
         .delete(`${endpoint}/2`)
         .set("Authorization", `Bearer invalid_token`)
         .send();

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });
});