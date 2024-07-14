import {ResponseError} from "../response/error.response.js";
import pkg from 'joi';
import {log} from "../utils/log.js";
import WebResponse from "../response/web.response.js";

const {ValidationError} = pkg;

const errorMiddleware = (err, req, res, next) => {
   if (!err) {
      return next();
   }

   log.error(err);

   if (err instanceof ResponseError) {
      console.log("ResponseError");
      WebResponse.error(res, err.status, err.errors);
   } else if (err instanceof ValidationError) {
      console.log("ValidationError");
      const errors = err.details.map(detail => {
         return {
            message: detail.message,
            path: detail.path.join('.')
         };
      });

      WebResponse.error(res, 400, errors);
   } else {
      console.log("Error");
      WebResponse.error(res, 500, err.message);
   }
}

export {errorMiddleware};