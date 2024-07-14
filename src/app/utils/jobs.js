import {prismaClient} from "../../config/database.js";

const checkPenalty = async () => {
   // check penalty on db, if penalty end date has passed, update penalty status to "INACTIVE"
   try {
      await prismaClient.$transaction(async (prisma) => {
         await prisma.penalty.updateMany({
            where: {
               status: "ACTIVE",
               endDate: {
                  lte: new Date()
               }
            },
            data: {
               status: "INACTIVE"
            }
         });
      });
   } catch (e) {
      console.error(e);
   }
}

export {checkPenalty};