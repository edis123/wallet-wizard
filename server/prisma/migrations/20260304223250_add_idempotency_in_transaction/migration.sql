-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "clientRequestId" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_userId_clientRequestId_idx" ON "Transaction"("userId", "clientRequestId");
