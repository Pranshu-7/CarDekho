-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "bodyType" TEXT,
    "price" INTEGER NOT NULL,
    "mileage" DOUBLE PRECISION,
    "safetyRating" DOUBLE PRECISION,
    "power" INTEGER,
    "fuelType" TEXT,
    "transmission" TEXT,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "carIds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_slug_key" ON "Shortlist"("slug");
