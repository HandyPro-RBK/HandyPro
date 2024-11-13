/*
  Warnings:

  - You are about to drop the column `address` on the `ServiceProvider` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `ServiceProvider` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "City" AS ENUM ('TUNIS', 'SFAX', 'SOUSSE', 'KAIROUAN', 'BIZERTE', 'GABES', 'ARIANA', 'GAFSA', 'MONASTIR', 'BEN_AROUS', 'KASSERINE', 'MEDENINE', 'NABEUL', 'TATAOUINE', 'BEJA', 'JENDOUBA', 'MAHDIA', 'SILIANA', 'KEF', 'TOZEUR', 'MANOUBA', 'ZAGHOUAN', 'KEBILI');

-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "address",
DROP COLUMN "age",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "city" "City" NOT NULL DEFAULT 'TUNIS',
ALTER COLUMN "certification" SET DATA TYPE TEXT,
ALTER COLUMN "identityCard" SET DATA TYPE TEXT,
ALTER COLUMN "isAvailable" SET DEFAULT false;
