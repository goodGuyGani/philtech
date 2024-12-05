-- CreateTable
CREATE TABLE `voucher` (
    `voucherId` INTEGER NOT NULL AUTO_INCREMENT,
    `voucherCode` VARCHAR(191) NOT NULL,
    `discountAmount` DOUBLE NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    INDEX `Voucher_voucherCode_idx`(`voucherCode`),
    PRIMARY KEY (`voucherId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
