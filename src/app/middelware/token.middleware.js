import webResponse from "../response/web.response.js";
import {decodeToken} from "../utils/token.js";

const verifyToken = async (req, res, next) => {
   let token = req.headers['authorization'];

   if (!token) {
      return webResponse.error(res, 401, 'Token is required');
   }

   token = token.replace('Bearer ', '');

   try {
      req.user = await decodeToken(token);
      next();
   } catch (error) {
      webResponse.error(res, 401, 'Invalid token');
   }
}

export {
   verifyToken
};