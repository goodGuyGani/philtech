/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `voucher` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `voucher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voucherCode]` on the table `voucher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucherAmount` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucherStatus` to the `voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Voucher_voucherCode_idx` ON `voucher`;

-- AlterTable
ALTER TABLE `voucher` DROP COLUMN `discountAmount`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `issuedDate` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `usedDate` DATETIME(3) NULL,
    ADD COLUMN `voucherAmount` DOUBLE NOT NULL,
    ADD COLUMN `voucherStatus` ENUM('Active', 'Expired', 'Used') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `voucher_voucherCode_key` ON `voucher`(`voucherCode`);
