/*
  Warnings:

  - You are about to alter the column `difficulty` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "difficulty" SET DATA TYPE INTEGER;
