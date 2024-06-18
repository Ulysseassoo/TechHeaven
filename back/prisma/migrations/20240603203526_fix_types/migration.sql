/*
  Warnings:

  - Changed the type of `total_amount` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quantity` on the `OrderDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unit_price` on the `OrderDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paid_amount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "total_amount",
ADD COLUMN     "total_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL,
DROP COLUMN "unit_price",
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paid_amount",
ADD COLUMN     "paid_amount" INTEGER NOT NULL;
