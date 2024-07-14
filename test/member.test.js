import {prismaClient} from "../src/config/database.js";
import {app} from "../src/config/app.js";
import supertest from "supertest";

let token;
let member;
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

beforeEach(async () => {
   await prismaClient.user.deleteMany({
      where: {
         email: "test@email.com"
      }
   });
   await prismaClient.book.deleteMany({
      where: {
         code: {
            in: ["B001", "B002", "B003", "B004"]
         }
      }
   });
   await prismaClient.borrowTransaction.deleteMany();

   const response = await supertest(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@email.com",
      password: "password"
   });
   token = response.body.data.token;
   let member_code = response.body.data.member_code;


   member = await prismaClient.member.findUnique({
      where: {
         code: member_code
      }
   });

   await prismaClient.book.createMany({
      data: books
   });
});

describe("GET '/api/members", () => {
   let members = [
      {
         name: "Member #1",
         email: "membertest1@email.com",
         password: "password"
      },
      {
         name: "Member #2",
         email: "membertest2@email.com",
         password: "password"
      },
      {
         name: "Member #3",
         email: "membertest3@email.com",
         password: "password"
      },
      {
         name: "Member #4",
         email: "membertest4@email.com",
         password: "password"
      },
      {
         name: "Member #5",
         email: "membertest5@email.com",
         password: "password"
      }
   ];

   beforeAll(async () => {
      await prismaClient.user.deleteMany({
         where: {
            email: {
               in: members.map(member => member.email)
            }
         }
      });

      for (let i = 0; i < members.length; i++) {
         const user = await supertest(app).post("/api/auth/register").send(members[i]);
         members[i].code = user.body.data.member_code;
      }
      console.log(members);
   });

   it("should return list of members", async () => {
      const result = await supertest(app)
         .get("/api/members")
         .set("Authorization", `Bearer ${token}`);

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBeGreaterThan(0);
   });

   it("should return 404 when member not found", async () => {
      await prismaClient.member.deleteMany();

      const result = await supertest(app)
         .get("/api/members")
         .set("Authorization", `Bearer ${token}`);

      expect(result.statusCode).toBe(404);
   });

   it("should return 401 when not authorized", async () => {
      const result = await supertest(app)
         .get("/api/members");

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });

   it("should return 401 if token is invalid", async () => {
      const result = await supertest(app)
         .get("/api/members")
         .set("Authorization", `Bearer invalid_token`);

      console.log(result.body);

      expect(result.statusCode).toBe(401);
   });
})

describe("POST '/api/members/:id/borrow'", () => {
   it("should successfully borrow a book", async () => {
      const result = await supertest(app)
         .post(`/api/members/${member.id}/borrow`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B001"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data.member_code).toBe(member.code);
      expect(result.body.data.book_code).toBe("B001");
   });

   it("should error when book is not available", async () => {
      const result = await supertest(app)
         .post(`/api/members/${member.id}/borrow`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B003"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(400);
   });

   it("should return 400 when member already borrow 2 books", async () => {
      await prismaClient.borrowTransaction.createMany({
         data: [
            {
               member_code: member.code,
               book_code: "B002",
               status: "ACTIVE"
            },
            {
               member_code: member.code,
               book_code: "B003",
               status: "ACTIVE"
            }
         ]
      });

      const result = await supertest(app)
         .post(`/api/members/${member.id}/borrow`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B001"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(400);
      expect(result.body.errors).toBe("Member already borrow 2 books");
   });

   it("should return 404 when member not found", async () => {
      const result = await supertest(app)
         .post("/api/members/999/borrow")
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B001"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(404);
      expect(result.body.errors).toBe("Member not found");
   });

   it("should return 404 when book not found", async () => {
      const result = await supertest(app)
         .post(`/api/members/${member.id}/borrow`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B999"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(404);
      expect(result.body.errors).toBe("Book not found");
   });

   it("should return 400 when member has penalty", async () => {
      const transaction = await prismaClient.borrowTransaction.create({
         data: {
            member_code: member.code,
            book_code: "B002",
            status: "ACTIVE"
         }
      });

      await prismaClient.penalty.create({
         data: {
            transaction_id: transaction.id,
            status: "ACTIVE",
            exceedDays: 5,
            endDate: new Date()
         }
      });

      const result = await supertest(app)
         .post(`/api/members/${member.id}/borrow`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            book_code: "B001"
         });

      console.log(result.body);

      expect(result.statusCode).toBe(400);
      expect(result.body.errors).toBe("Member has penalty");
   });
});

describe("POST '/api/members/:id/return'", () => {

   let transaction;

   beforeEach(async () => {
      await prismaClient.borrowTransaction.deleteMany();

      transaction = await prismaClient.borrowTransaction.create({
         data: {
            member_code: member.code,
            book_code: "B001",
            status: "ACTIVE"
         }
      });
   });

   it("should successfully return a book", async () => {
      const result = await supertest(app)
         .post(`/api/members/${member.id}/return`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data.member_code).toBe(member.code);
      expect(result.body.data.book_code).toBe("B001");
   });

   it("should return 400 when book already returned", async () => {
      await prismaClient.borrowTransaction.update({
         where: {
            id: transaction.id
         },
         data: {
            status: "RETURNED"
         }
      });

      const result = await supertest(app)
         .post(`/api/members/${member.id}/return`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(400);
      expect(result.body.errors).toBe("Book already returned");
   });

   it("should return 404 when member not found", async () => {
      const result = await supertest(app)
         .post("/api/members/999/return")
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(404);
      expect(result.body.errors).toBe("Member not found");
   });

   it("should return 400 when book is not borrowed the member", async () => {
      await prismaClient.user.deleteMany({
         where: {
            email: "test2@email.com"
         }
      });

      const user2 = await supertest(app).post("/api/auth/register").send({
         name: "Test User 2",
         email: "test2@email.com",
         password: "password"
      });

      const member2 = await prismaClient.member.findUnique({
         where: {
            code: user2.body.data.member_code
         }
      });

      const result = await supertest(app)
         .post(`/api/members/${member2.id}/return`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(403);
      expect(result.body.errors).toBe("You are not authorized to access this resource");
   });

   it("should not make penalty when return book less than 7 days", async () => {
      const result = await supertest(app)
         .post(`/api/members/${member.id}/return`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data.penalty).toBeUndefined();
   });

   it("should make penalty when return book exceed 7 days", async () => {
      await prismaClient.borrowTransaction.update({
         where: {
            id: transaction.id
         },
         data: {
            createdAt: new Date(new Date().setDate(new Date().getDate() - 8))
         }
      });

      const result = await supertest(app)
         .post(`/api/members/${member.id}/return`)
         .set("Authorization", `Bearer ${token}`)
         .send({
            transaction_id: transaction.id
         });

      console.log(result.body);

      expect(result.statusCode).toBe(200);
      expect(result.body.data.penalty).not.toBeNull();
   });
});