/*
  Warnings:

  - You are about to drop the column `identity` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_identity_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `identity`,
    ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
