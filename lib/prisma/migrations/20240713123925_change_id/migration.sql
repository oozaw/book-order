/*
  Warnings:

  - The primary key for the `book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `borrowtransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `borrowtransaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `borrowtransaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `book_id` on the `borrowtransaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `user_id` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `penalty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `penalty` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `penalty` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `endDate` to the `Penalty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exceedDays` to the `Penalty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `Penalty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `member` DROP FOREIGN KEY `Member_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `penalty` DROP FOREIGN KEY `Penalty_user_id_fkey`;

-- AlterTable
ALTER TABLE `book` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `borrowtransaction` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `book_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `member` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `penalty` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `exceedDays` INTEGER NOT NULL,
    ADD COLUMN `transaction_id` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penalty` ADD CONSTRAINT `Penalty_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `BorrowTransaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
