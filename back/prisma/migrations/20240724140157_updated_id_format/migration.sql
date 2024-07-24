/*
  Warnings:

  - The primary key for the `StockHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `StockHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StockHistory_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "StockHistory_id_key" ON "StockHistory"("id");
