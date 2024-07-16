/*
  Warnings:

  - The primary key for the `Preference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,alert_id]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Preference` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Preference_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_id_key" ON "Preference"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_user_id_alert_id_key" ON "Preference"("user_id", "alert_id");
