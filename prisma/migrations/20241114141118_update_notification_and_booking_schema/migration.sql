/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_bookingId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "bookingId",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "NotificationType";
