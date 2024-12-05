/*
  Warnings:

  - You are about to drop the column `referrenceNumber` on the `voucher` table. All the data in the column will be lost.
  - Added the required column `referenceNumber` to the `voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `voucher` DROP COLUMN `referrenceNumber`,
    ADD COLUMN `referenceNumber` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'UNUSED';
