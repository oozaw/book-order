-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrowtransaction` DROP FOREIGN KEY `BorrowTransaction_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `member` DROP FOREIGN KEY `Member_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `penalty` DROP FOREIGN KEY `Penalty_transaction_id_fkey`;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowTransaction` ADD CONSTRAINT `BorrowTransaction_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penalty` ADD CONSTRAINT `Penalty_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `BorrowTransaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
