/*
  Warnings:

  - You are about to drop the column `userId` on the `ServiceProvider` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceProvider" DROP CONSTRAINT "ServiceProvider_userId_fkey";

-- DropIndex
DROP INDEX "ServiceProvider_userId_key";

-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "userId";
