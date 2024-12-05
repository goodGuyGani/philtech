/*
  Warnings:

  - You are about to alter the column `voucherStatus` on the `voucher` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `voucher` MODIFY `voucherStatus` VARCHAR(191) NOT NULL;
