-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "age" SET DATA TYPE TEXT;
