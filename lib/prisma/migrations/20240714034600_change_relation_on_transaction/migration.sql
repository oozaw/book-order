/*
  Warnings:

  - You are about to drop the column `user_id` on the `borrowtransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `member_id` to the `BorrowTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_user_id_fkey`;

-- AlterTable
ALTER TABLE `borrowtransaction` DROP COLUMN `user_id`,
    ADD COLUMN `member_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Member_user_id_key` ON `Member`(`user_id`);

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
