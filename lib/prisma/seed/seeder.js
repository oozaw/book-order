import {prismaClient} from "../../../src/config/database.js";
import {faker} from "@faker-js/faker";
import bcrypt from "bcrypt";

const seed = async () => {
   // users and members
   await prismaClient.user.deleteMany({});
   await prismaClient.member.deleteMany({});

   const amountOfUsers = 120;

   const hashedPassword = await bcrypt.hash("password", 10);

   const user = await prismaClient.user.create({
      data: {
         name: "John Doe",
         email: "johndoe@email.com",
         password: hashedPassword,
      },
   });

   await prismaClient.member.create({
      data: {
         user_id: user.id,
         code: `M${user.id.toString().padStart(3, "0")}`
      }
   });

   for (let i = 0; i < amountOfUsers; i++) {
      let user = await prismaClient.user.create({
         data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
         }
      });

     await prismaClient.member.create({
         data: {
            user_id: user.id,
            code: `M${user.id.toString().padStart(3, "0")}`
         }
      });
   }

   // books
   await prismaClient.book.deleteMany({});

   const amountOfBooks = 100;

   for (let i = 0; i < amountOfBooks; i++) {
      const name = faker.commerce.productName();

      const code = `${name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

      await prismaClient.book.create({
         data: {
            title: name,
            code: code,
            author: faker.person.fullName(),
            status: faker.helpers.arrayElement(["AVAILABLE", "BORROWED"]),
         }
      });
   }
}

seed().then(async () => {
   console.log("Database seeded successfully");
   await prismaClient.$disconnect();
}).catch(async (error) => {
   console.error(error);
   await prismaClient.$disconnect();
});