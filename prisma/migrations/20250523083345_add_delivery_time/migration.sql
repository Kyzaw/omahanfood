/*
  Warnings:

  - Added the required column `deliveryTime` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryTime" AS ENUM ('PAGI', 'SIANG', 'SORE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryTime" "DeliveryTime" NOT NULL;
