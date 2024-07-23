-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_promotion_id_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "promotion_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
