/*
  Warnings:

  - Added the required column `user_firstname` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_lastname` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "user_firstname" TEXT NOT NULL,
ADD COLUMN     "user_lastname" TEXT NOT NULL;
