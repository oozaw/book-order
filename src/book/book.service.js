import {validate} from "../app/validation/index.js";
import {createBookValidation} from "./book.validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../app/response/error.response.js";
import {paginate} from "../app/utils/pagination.js";

const create = async (request) => {
   const data = validate(createBookValidation, request);

   const book = await prismaClient.book.findUnique({
      where: {
         code: data.code
      }
   });

   if (book) {
      throw new ResponseError("Bad Request", 400, "Book already exists");
   }

   return prismaClient.book.create({
      data,
   });
};

const get = async (bookId) => {
   const book = await prismaClient.book.findUnique({
      where: {
         id: bookId,
      },
   });

   if (!book) {
      throw new ResponseError("Not Found", 404, "Book not found");
   }

   return book;
};

const getMany = async (query) => {
   let filter = {};

   if (query.title) {
      filter.title = {
         contains: query.title,
      };
   }

   if (query.author) {
      filter.author = {
         contains: query.author,
      };
   }

   if (query.available_only) {
      filter.status = "AVAILABLE"
   }

   const result = await prismaClient.book.findMany({
      where: {
         ...filter,
      },
   });

   if (result.length === 0) {
      throw new ResponseError("Not Found", 404, "Books not found");
   }

   return paginate(result, query.page, query.limit);
};

const remove = async (bookId) => {
   const book = await prismaClient.book.findUnique({
      where: {
         id: bookId,
      },
   });

   if (!book) {
      throw new ResponseError("Not Found", 404, "Book not found");
   }

   await prismaClient.book.delete({
      where: {
         id: bookId,
      },
   });
};

export default {
   create,
   get,
   getMany,
   remove
}