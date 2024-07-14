import {paginate} from "../app/utils/pagination.js";
import {ResponseError} from "../app/response/error.response.js";
import {prismaClient} from "../config/database.js";
import {validate} from "../app/validation/index.js";
import {borrowBookValidation, returnBookValidation} from "./member.validation.js";

const getMany = async (query) => {
   let filter = {};

   if (query.name) {
      filter.name = {
         contains: query.name,
      };
   }

   if (query.email) {
      filter.email = {
         contains: query.email,
      };
   }

   const result = await prismaClient.member.findMany({
      where: {
         user: {
            ...filter,
         },
      },
      include: {
         user: true,
         transactions: {
            where: {
               status: "ACTIVE"
            },
            select: {
               book: true,
            },
         }
      }
   });

   if (result.length === 0) {
      throw new ResponseError("Not Found", 404, "Members not found");
   }

   let data = paginate(result, query.page, query.limit);

   for (let i = 0; i < data.length; i++) {
      data[i].user_id = data[i].user.id;
      data[i].name = data[i].user.name;
      data[i].email = data[i].user.email;
      delete data[i].user;

      let transactions = data[i].transactions;
      let borrowedBooks = [];
      for (let j = 0; j < transactions.length; j++) {
         borrowedBooks.push(transactions[j].book);
      }
      data[i].borrowed_books = borrowedBooks;
      delete data[i].transactions;
   }

   return data;
}

const borrowBook = async (request, memberId) => {
   const data = validate(borrowBookValidation, request);

   const member = await prismaClient.member.findUnique({
      where: {
         id: memberId
      }
   });
   if (!member) {
      throw new ResponseError("Not Found", 404, "Member not found");
   }

   const book = await prismaClient.book.findUnique({
      where: {
         code: data.book_code
      }
   });

   if (!book) {
      throw new ResponseError("Not Found", 404, "Book not found");
   }

   // check if book is available
   if (book.status === "BORROWED") {
      throw new ResponseError("Bad Request", 400, "Book not available");
   }

   // check if member already borrow 2 books
   const transactionsActive = await prismaClient.borrowTransaction.findMany({
      where: {
         member_code: member.code,
         status: "ACTIVE"
      }
   });

   if (transactionsActive.length >= 2) {
      throw new ResponseError("Bad Request", 400, "Member already borrow 2 books");
   }

   // check member's penalty
   const penalties = await prismaClient.penalty.findMany({
      where: {
         status: "ACTIVE",
         transaction: {
            member_code: member.code
         }
      }
   });

   if (penalties.length > 0) {
      throw new ResponseError("Bad Request", 400, "Member has penalty");
   }

   return prismaClient.$transaction(async (prisma) => {
      const transaction = await prisma.borrowTransaction.create({
         data: {
            member: {
               connect: {
                  id: memberId
               }
            },
            book: {
               connect: {
                  code: data.book_code
               }
            },
            status: "ACTIVE",
            returnedAt: null
         }
      });

      // update in raw query with for update mode
      await prisma.$executeRaw`
          SELECT *
          FROM book
          WHERE code = ${data.book_code} FOR UPDATE;
      `;

      await prisma.book.update({
         where: {
            code: data.book_code
         },
         data: {
            status: "BORROWED",
            stock: {
               decrement: 1
            }
         }
      });

      return transaction;
   });
};

const returnBook = async (request, memberId) => {
   const data = validate(returnBookValidation, request);

   const member = await prismaClient.member.findUnique({
      where: {
         id: memberId
      }
   });

   if (!member) {
      throw new ResponseError("Not Found", 404, "Member not found");
   }

   const transaction = await prismaClient.borrowTransaction.findUnique({
      where: {
         id: data.transaction_id
      }
   });

   if (!transaction) {
      throw new ResponseError("Not Found", 404, "Transaction not found");
   }

   if (transaction.status === "RETURNED") {
      throw new ResponseError("Bad Request", 400, "Book already returned");
   }

   if (transaction.member_code !== member.code) {
      throw new ResponseError("Forbidden", 403, "You are not authorized to access this resource");
   }

   // check if book returned at the right time, which is 7 days after borrowed
   const borrowedDate = transaction.createdAt;
   const currentDate = new Date();
   const diffTime = Math.abs(currentDate - borrowedDate);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

   let penalty = null;

   return prismaClient.$transaction(async (prisma) => {
      if (diffDays > 7) {
         const endDate = new Date();
         endDate.setDate(endDate.getDate() + 3);

         penalty = await prisma.penalty.create({
            data: {
               transaction: {
                  connect: {
                     id: data.transaction_id
                  }
               },
               status: "ACTIVE",
               exceedDays: diffDays - 7,
               endDate: endDate
            }
         });
      }

      await prisma.$executeRaw`
          SELECT *
          FROM book
          WHERE code = ${transaction.book_code} FOR UPDATE;
      `;

      await prisma.book.update({
         where: {
            code: transaction.book_code
         },
         data: {
            status: "AVAILABLE",
            stock: {
               increment: 1
            }
         }
      });

      const result = await prisma.borrowTransaction.update({
         where: {
            id: data.transaction_id
         },
         data: {
            status: "RETURNED",
            returnedAt: new Date()
         }
      });

      if (penalty) result.penalty = penalty;

      return result;
   });
};

export default {
   getMany,
   borrowBook,
   returnBook,
}