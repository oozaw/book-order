import bookService from './book.service.js';
import WebResponse from "../app/response/web.response.js";

const createBook = async (req, res, next) => {
   try {
      const result = await bookService.create(req.body);
      WebResponse.success(res, 201, result);
   } catch (error) {
      next(error)
   }
}

const getBook = async (req, res, next) => {
   try {
      const result = await bookService.get(Number(req.params.id));
      WebResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
}

const getAvailableBooks = async (req, res, next) => {
   try {
      req.query.available_only = true;
      const result = await bookService.getMany(req.query);
      WebResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
}

const getListBooks = async (req, res, next) => {
   try {
      const result = await bookService.getMany(req.query);
      WebResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
}

const removeBook = async (req, res, next) => {
   try {
      await bookService.remove(Number(req.params.id));
      WebResponse.success(res, 200);
   } catch (error) {
      next(error)
   }

}

export default {
   createBook,
   getBook,
   getListBooks,
   getAvailableBooks,
   removeBook
}