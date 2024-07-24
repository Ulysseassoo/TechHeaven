/*
  Warnings:

  - You are about to drop the column `delivery_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Delivery` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_delivery_id_fkey";

-- AlterTable
ALTER TABLE "Delivery" ALTER COLUMN "status" SET DEFAULT 'En cours';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivery_id";

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_order_id_key" ON "Delivery"("order_id");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
