/*
  Warnings:

  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_quantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quantity",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "promo" DOUBLE PRECISION,
ADD COLUMN     "stock_quantity" INTEGER NOT NULL;
