/*
  Warnings:

  - You are about to drop the column `payment_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_payment_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_id";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
