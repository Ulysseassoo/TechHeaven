/*
  Warnings:

  - You are about to drop the column `date` on the `Order` table. All the data in the column will be lost.
  - Added the required column `product_description` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'En cours';

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "product_description" TEXT NOT NULL,
ADD COLUMN     "product_name" TEXT NOT NULL;
