-- CreateTable
CREATE TABLE "public"."_SeedingHistory" (
    "id" TEXT NOT NULL,
    "seedName" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_SeedingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeedingHistory_seedName_key" ON "public"."_SeedingHistory"("seedName");
