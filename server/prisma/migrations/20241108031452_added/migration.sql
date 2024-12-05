-- AlterTable
ALTER TABLE `voucher` ADD COLUMN `usedMerchant` INTEGER NULL;

-- CreateTable
CREATE TABLE `merchant` (
    `merchantId` INTEGER NOT NULL AUTO_INCREMENT,
    `merchantName` VARCHAR(191) NOT NULL,
    `merchantEmail` VARCHAR(191) NOT NULL,
    `merchantUsername` VARCHAR(191) NOT NULL,
    `merchantPassword` VARCHAR(191) NOT NULL,
    `merchantPhone` VARCHAR(191) NULL,
    `merchantAddress` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `businessName` VARCHAR(191) NULL,
    `businessType` VARCHAR(191) NULL,
    `taxId` VARCHAR(191) NULL,
    `bankAccountNumber` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `payoutMethod` VARCHAR(191) NULL,
    `lastLogin` DATETIME(3) NULL,
    `passwordResetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `merchant_merchantEmail_key`(`merchantEmail`),
    UNIQUE INDEX `merchant_merchantUsername_key`(`merchantUsername`),
    PRIMARY KEY (`merchantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `voucher` ADD CONSTRAINT `voucher_usedMerchant_fkey` FOREIGN KEY (`usedMerchant`) REFERENCES `merchant`(`merchantId`) ON DELETE SET NULL ON UPDATE CASCADE;
