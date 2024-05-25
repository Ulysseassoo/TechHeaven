/*
  Warnings:

  - The `code_validation_time` column on the `PasswordRecovery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PasswordRecovery" DROP COLUMN "code_validation_time",
ADD COLUMN     "code_validation_time" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "brand" TEXT NULL,
    "photo" TEXT,
    "promo" DOUBLE PRECISION,
    "stock_quantity" INTEGER NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
