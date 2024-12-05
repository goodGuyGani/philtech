-- CreateTable
CREATE TABLE `atm_merchant_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchantId` VARCHAR(50) NOT NULL,
    `merchantName` VARCHAR(255) NULL,
    `transactionDate` DATETIME(3) NULL,
    `withdrawCount` INTEGER NOT NULL DEFAULT 0,
    `balanceInquiryCount` INTEGER NOT NULL DEFAULT 0,
    `fundTransferCount` INTEGER NOT NULL DEFAULT 0,
    `totalTransactionCount` INTEGER NOT NULL DEFAULT 0,
    `withdrawAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `balanceInquiryAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `fundTransferAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `totalAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `transactionFeeRCBC` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `transactionFeeMerchant` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
