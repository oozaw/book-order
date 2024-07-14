import * as http from "http";

class WebResponse {

   static success(res, statusCode, data = null) {
      let response = {
         status: http.STATUS_CODES[statusCode].toUpperCase(),
         code: statusCode,
      };

      if (data) {
         response["data"] = data;

         if (data.hasOwnProperty("metadata")) {
            response["metadata"] = data.metadata;
            delete data.metadata;
         }
      }

      res.status(statusCode).json(response).end();
   }

   static error(res, statusCode, errors = null) {
      let response = {
         status: http.STATUS_CODES[statusCode].toUpperCase(),
         code: statusCode,
      };

      if (errors) {
         response["errors"] = errors;
      }

      res.status(statusCode).json(response).end();
   }
}

export default WebResponse;