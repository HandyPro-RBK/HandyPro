/*
  Warnings:

  - The values [PROVIDER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The `certification` column on the `ServiceProvider` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CUSTOMER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "userType" TYPE "UserRole_new" USING ("userType"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropIndex
DROP INDEX "ServiceProvider_username_key";

-- AlterTable
ALTER TABLE "ServiceProvider" ADD COLUMN     "identityCard" BYTEA,
DROP COLUMN "certification",
ADD COLUMN     "certification" BYTEA,
ALTER COLUMN "age" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userType" SET DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "Admin";
