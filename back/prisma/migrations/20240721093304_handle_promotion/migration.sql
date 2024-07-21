/*
  Warnings:

  - You are about to drop the column `lowStockAlert` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `promo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductHasPromotion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductHasPromotion" DROP CONSTRAINT "ProductHasPromotion_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductHasPromotion" DROP CONSTRAINT "ProductHasPromotion_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductHasPromotion" DROP CONSTRAINT "ProductHasPromotion_user_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "lowStockAlert",
DROP COLUMN "photo",
DROP COLUMN "promo",
DROP COLUMN "stock_quantity",
ADD COLUMN     "promotion" DOUBLE PRECISION,
ADD COLUMN     "promotion_type" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductHasPromotion";

-- CreateTable
CREATE TABLE "UserHasPromotion" (
    "user_id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,

    CONSTRAINT "UserHasPromotion_pkey" PRIMARY KEY ("user_id","promotion_id")
);

-- AddForeignKey
ALTER TABLE "UserHasPromotion" ADD CONSTRAINT "UserHasPromotion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHasPromotion" ADD CONSTRAINT "UserHasPromotion_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
