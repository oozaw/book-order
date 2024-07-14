import {validate} from "../app/validation/index.js";
import {createBookValidation} from "./book.validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../app/response/error.response.js";

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

   // pagination
   const page = Number(query.page) || 1;
   const limit = Number(query.limit) || 10;
   const totalPage = Math.ceil(result.length / limit);

   const metadata = {
      currentPage: page,
      limit: limit,
      totalItems: result.length,
      totalPage: totalPage
   }

   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;

   let data = result.slice(startIndex, endIndex);

   if (endIndex < result.length) {
      metadata.next = {
         page: page + 1,
         limit: limit
      }
   } else {
      metadata.next = null;
   }

   if (startIndex > 0) {
      metadata.previous = {
         page: page - 1,
         limit: limit
      }
   } else {
      metadata.previous = null;
   }

   data.metadata = metadata;

   return data;
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