/*
  Warnings:

  - Added the required column `discountAmount` to the `voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `voucher` ADD COLUMN `discountAmount` DOUBLE NOT NULL;
