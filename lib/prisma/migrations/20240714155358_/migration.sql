/*
  Warnings:

  - You are about to drop the column `amount` on the `penalty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `borrowtransaction` MODIFY `returnedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `penalty` DROP COLUMN `amount`;
