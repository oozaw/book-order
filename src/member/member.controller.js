import webResponse from "../app/response/web.response.js";
import memberService from "./member.service.js";

const getListMembers = async (req, res, next) => {
   try {
      const result = await memberService.getMany(req.query);

      return webResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
};

const borrowBook = async (req, res, next) => {
   try {
      const result = await memberService.borrowBook(req.body, Number(req.params.id));

      return webResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
};

const returnBook = async (req, res, next) => {
   try {
      const result = await memberService.returnBook(req.body, Number(req.params.id));

      return webResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
};

export default {
   getListMembers,
   borrowBook,
   returnBook
};