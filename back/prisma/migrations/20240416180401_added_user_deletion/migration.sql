/*
  Warnings:

  - The `code_validation_time` column on the `PasswordRecovery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PasswordRecovery" DROP COLUMN "code_validation_time",
ADD COLUMN     "code_validation_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3);
