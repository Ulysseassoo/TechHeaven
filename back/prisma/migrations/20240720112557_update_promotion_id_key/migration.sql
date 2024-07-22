/*
  Warnings:

  - The primary key for the `ProductHasPromotion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Promotion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductHasPromotion" DROP CONSTRAINT "ProductHasPromotion_promotion_id_fkey";

-- AlterTable
ALTER TABLE "ProductHasPromotion" DROP CONSTRAINT "ProductHasPromotion_pkey",
ALTER COLUMN "promotion_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductHasPromotion_pkey" PRIMARY KEY ("product_id", "promotion_id", "user_id");

-- AlterTable
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Promotion_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_id_key" ON "Promotion"("id");

-- AddForeignKey
ALTER TABLE "ProductHasPromotion" ADD CONSTRAINT "ProductHasPromotion_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
