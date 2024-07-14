import setRateLimit from "express-rate-limit"
import webResponse from "../response/web.response.js";
import {ResponseError} from "../response/error.response.js";

const rateLimitMiddleware = setRateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   message: "Too many requests from this IP, please try again after 15 minutes",
   legacyHeaders: true,
   handler: (req, res) => {
      throw new ResponseError("Too Many Requests", 429, "Too many requests from this IP, please try again after 15 minutes");
   }
});

export {rateLimitMiddleware}