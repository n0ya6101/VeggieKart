/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."IdSequence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "IdSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdSequence_name_key" ON "public"."IdSequence"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "public"."Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "public"."Product"("id");
