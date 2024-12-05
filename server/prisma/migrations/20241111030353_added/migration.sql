/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `voucher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referenceNumber]` on the table `voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `distributor` (
    `distributorId` VARCHAR(191) NOT NULL,
    `distributorName` VARCHAR(191) NOT NULL,
    `distributorEmail` VARCHAR(191) NOT NULL,
    `distributorUsername` VARCHAR(191) NOT NULL,
    `distributorPassword` VARCHAR(191) NOT NULL,
    `distributorPhone` VARCHAR(191) NULL,
    `distributorAddress` VARCHAR(191) NULL,
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

    UNIQUE INDEX `distributor_distributorEmail_key`(`distributorEmail`),
    UNIQUE INDEX `distributor_distributorUsername_key`(`distributorUsername`),
    PRIMARY KEY (`distributorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_history` (
    `transactionId` VARCHAR(191) NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `distributorId` VARCHAR(191) NULL,
    `merchantId` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `voucher_serialNumber_key` ON `voucher`(`serialNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `voucher_referenceNumber_key` ON `voucher`(`referenceNumber`);

-- AddForeignKey
ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `merchant`(`merchantId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_distributorId_fkey` FOREIGN KEY (`distributorId`) REFERENCES `distributor`(`distributorId`) ON DELETE SET NULL ON UPDATE CASCADE;
