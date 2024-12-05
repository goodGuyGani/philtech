/*
  Warnings:

  - Made the column `transactionDate` on table `atm_merchant_transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `atm_merchant_transaction` MODIFY `transactionDate` VARCHAR(191) NOT NULL;
