import authService from "./auth.service.js";
import WebResponse from "../app/response/web.response.js";

const register = async (req, res, next) => {
   try {
      const result = await authService.register(req.body);
      WebResponse.success(res, 201, result);
   } catch (error) {
      next(error)
   }
}

const login = async (req, res, next) => {
   try {
      const result = await authService.login(req.body);
      WebResponse.success(res, 200, result);
   } catch (error) {
      next(error)
   }
}

export default {
   register,
   login
}