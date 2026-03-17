/*
  Warnings:

  - A unique constraint covering the columns `[userId,clientRequestId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transaction_userId_clientRequestId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userId_clientRequestId_key" ON "Transaction"("userId", "clientRequestId");
