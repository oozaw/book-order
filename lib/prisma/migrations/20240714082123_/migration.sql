/*
  Warnings:

  - You are about to drop the column `returnAt` on the `borrowtransaction` table. All the data in the column will be lost.
  - Added the required column `returnedAt` to the `BorrowTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `borrowtransaction` DROP COLUMN `returnAt`,
    ADD COLUMN `returnedAt` DATETIME(3) NOT NULL;
