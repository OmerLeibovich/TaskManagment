/*
  Warnings:

  - You are about to alter the column `name` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[name]` on the table `task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "task" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "task_name_key" ON "task"("name");
