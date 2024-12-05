-- CreateTable
CREATE TABLE `tv_voucher` (
    `tvVoucherId` VARCHAR(191) NOT NULL,
    `cardNumber` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `account` VARCHAR(191) NOT NULL DEFAULT 'null',
    `amount` INTEGER NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tvVoucherId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
