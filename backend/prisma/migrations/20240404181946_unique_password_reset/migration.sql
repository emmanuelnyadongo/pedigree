/*
  Warnings:

  - A unique constraint covering the columns `[password_reset_token]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Supplier_password_reset_token_key" ON "Supplier"("password_reset_token");
