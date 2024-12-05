-- CreateTable
CREATE TABLE `wifi_voucher` (
    `wifiVoucherId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `surfing` INTEGER NOT NULL,
    `validityDays` INTEGER NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `validityText` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`wifiVoucherId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
