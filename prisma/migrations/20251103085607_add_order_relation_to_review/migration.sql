/*
  Warnings:

  - A unique constraint covering the columns `[orderId,menuId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "orderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_menuId_key" ON "Review"("orderId", "menuId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
