/*
  Warnings:

  - You are about to drop the column `status` on the `Preference` table. All the data in the column will be lost.
  - Added the required column `isEnabled` to the `Preference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "status",
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL;
