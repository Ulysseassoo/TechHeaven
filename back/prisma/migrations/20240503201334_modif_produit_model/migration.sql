/*
  Warnings:

  - Made the column `brand` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock_quantity` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "stock_quantity" SET NOT NULL;
