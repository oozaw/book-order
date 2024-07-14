import {validate} from "../app/validation/index.js";
import {loginValidation, registerValidation} from "./auth.validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../app/response/error.response.js";
import * as bcrypt from "bcrypt";
import {generateToken} from "../app/utils/token.js";
import {log} from "../app/utils/log.js";

const register = async (request) => {
   const user = validate(registerValidation, request);

   const userCount = await prismaClient.user.count({
      where: {
         email: user.email
      }
   });

   if (userCount > 0) {
      throw new ResponseError("Bad Request", 400, "Email already exists");
   }

   const hashedPassword = await bcrypt.hash(user.password, 10);

   return prismaClient.$transaction(async (prisma) => {
      const result = await prisma.user.create({
         data: {
            name: user.name,
            email: user.email,
            password: hashedPassword
         },
         select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
         }
      });

      const lastMember = await prisma.member.findFirst({
         orderBy: {
            id: "desc"
         }
      });

      const lastMemberId = lastMember ? lastMember.id : 0;

      const member = await prisma.member.create({
         data: {
            user_id: result.id,
            code: `M${(lastMemberId + 1).toString().padStart(3, "0")}`
         }
      });

      result.member_code= member.code;
      result.token = await generateToken(result);

      return result;
   });
};

const login = async (request) => {
   validate(loginValidation, request);

   const user = await prismaClient.user.findUnique({
      where: {
         email: request.email
      },
      select: {
         id: true,
         name: true,
         email: true,
         password: true,
         createdAt: true,
         updatedAt: true,
         member: {
            select: {
               code: true
            }
         }
      }
   });

   if (!user) {
      throw new ResponseError("Unauthorized", 401, "Invalid email or password");
   }

   user.member_code = user.member.code;
   delete user.member;

   const isPasswordValid = await bcrypt.compare(request.password, user.password);

   if (!isPasswordValid) {
      throw new ResponseError("Unauthorized", 401, "Invalid email or password");
   }

   const token = await generateToken(user);

   return {
      id: user.id,
      member_code: user.member_code,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token
   };
}

export default {
   register,
   login
}