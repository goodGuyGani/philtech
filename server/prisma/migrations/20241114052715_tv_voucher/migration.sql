/*
  Warnings:

  - You are about to drop the column `password` on the `tv_voucher` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `tv_voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucherCode` to the `tv_voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tv_voucher` DROP COLUMN `password`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `voucherCode` VARCHAR(191) NOT NULL;
