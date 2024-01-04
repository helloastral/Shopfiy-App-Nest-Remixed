-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSession" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "AppSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "Shop"("name");
