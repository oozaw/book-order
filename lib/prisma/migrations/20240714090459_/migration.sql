/*
  Warnings:

  - You are about to drop the column `slug` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `borrowtransaction` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `borrowtransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_code` to the `BorrowTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_code` to the `BorrowTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_member_id_fkey`;

-- DropIndex
DROP INDEX `Book_slug_key` ON `book`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `slug`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `borrowtransaction` DROP COLUMN `book_id`,
    DROP COLUMN `member_id`,
    ADD COLUMN `book_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `member_code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Book_code_key` ON `Book`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Member_code_key` ON `Member`(`code`);

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_member_code_fkey` FOREIGN KEY (`member_code`) REFERENCES `Member`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_book_code_fkey` FOREIGN KEY (`book_code`) REFERENCES `Book`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
