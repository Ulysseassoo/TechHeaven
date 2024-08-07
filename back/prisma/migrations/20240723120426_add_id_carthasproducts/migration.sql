/*
  Warnings:

  - The primary key for the `CartHasProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `CartHasProducts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cart_id,product_id]` on the table `CartHasProducts` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `CartHasProducts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "CartHasProducts" DROP CONSTRAINT "CartHasProducts_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CartHasProducts_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CartHasProducts_id_key" ON "CartHasProducts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CartHasProducts_cart_id_product_id_key" ON "CartHasProducts"("cart_id", "product_id");
