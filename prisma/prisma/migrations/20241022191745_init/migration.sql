/*
  Warnings:

  - You are about to drop the column `certificate` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phoneNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `address` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userType` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "certificate",
DROP COLUMN "experienceYears",
DROP COLUMN "rating",
DROP COLUMN "userId",
DROP COLUMN "verified",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "providerId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "verified",
ADD COLUMN     "photoUrl" VARCHAR(1024),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" VARCHAR(50) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
DROP COLUMN "userType",
ADD COLUMN     "userType" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "certification" VARCHAR(255),
    "photoUrl" VARCHAR(1024),
    "address" VARCHAR(255),
    "phoneNumber" VARCHAR(15),
    "age" INTEGER,
    "rating" DECIMAL(3,2) DEFAULT 0.0,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "providerId" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_userId_key" ON "ServiceProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
