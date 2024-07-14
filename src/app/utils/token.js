import jwt from "jsonwebtoken";

const generateToken = async (user) => {
   return jwt.sign(
      {
         user_id: user.id,
         member_code: user.member_code,
         name: user.name,
         email: user.email,
      },
      process.env.JWT_SECRET,
      {
         expiresIn: "1h",
      }
   );
};

const decodeToken = async (token) => {
   return jwt.verify(token, process.env.JWT_SECRET);
};

export {
   generateToken,
   decodeToken
}