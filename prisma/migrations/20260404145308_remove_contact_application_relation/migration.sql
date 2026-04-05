/*
  Warnings:

  - You are about to drop the `_ApplicationToContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ApplicationToContact" DROP CONSTRAINT "_ApplicationToContact_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApplicationToContact" DROP CONSTRAINT "_ApplicationToContact_B_fkey";

-- DropTable
DROP TABLE "_ApplicationToContact";
