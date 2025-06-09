/*
  Warnings:

  - Added the required column `image` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "image" TEXT NOT NULL;
