/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherAmount` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherCode` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherStatus` on the `voucher` table. All the data in the column will be lost.
  - Added the required column `amount` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrenceNumber` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `voucher_voucherCode_key` ON `voucher`;

-- AlterTable
ALTER TABLE `voucher` DROP COLUMN `discountAmount`,
    DROP COLUMN `voucherAmount`,
    DROP COLUMN `voucherCode`,
    DROP COLUMN `voucherStatus`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL,
    ADD COLUMN `productCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `referrenceNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
