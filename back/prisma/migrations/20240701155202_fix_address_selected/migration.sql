/*
  Warnings:

  - The `is_selected` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "is_selected",
ADD COLUMN     "is_selected" BOOLEAN NOT NULL DEFAULT false;
