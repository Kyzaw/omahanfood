-- CreateEnum
CREATE TYPE "JenisPaket" AS ENUM ('HARIAN', 'MINGGUAN', 'BULANAN');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "jenisPaket" "JenisPaket" NOT NULL DEFAULT 'HARIAN';
