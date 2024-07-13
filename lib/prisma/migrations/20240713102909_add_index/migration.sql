-- CreateIndex
CREATE INDEX `Book_status_idx` ON `Book`(`status`);

-- CreateIndex
CREATE INDEX `BorrowTransaction_status_idx` ON `BorrowTransaction`(`status`);

-- CreateIndex
CREATE INDEX `Penalty_status_idx` ON `Penalty`(`status`);
