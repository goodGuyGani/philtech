/*
  Warnings:

  - The primary key for the `merchant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `voucher` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `voucher` DROP FOREIGN KEY `voucher_usedMerchant_fkey`;

-- AlterTable
ALTER TABLE `merchant` DROP PRIMARY KEY,
    MODIFY `merchantId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`merchantId`);

-- AlterTable
ALTER TABLE `voucher` DROP PRIMARY KEY,
    MODIFY `voucherId` VARCHAR(191) NOT NULL,
    MODIFY `usedMerchant` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`voucherId`);

-- AddForeignKey
ALTER TABLE `voucher` ADD CONSTRAINT `voucher_usedMerchant_fkey` FOREIGN KEY (`usedMerchant`) REFERENCES `merchant`(`merchantId`) ON DELETE SET NULL ON UPDATE CASCADE;
