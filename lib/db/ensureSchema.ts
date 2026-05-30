import { prisma } from "@/lib/prisma";

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;
  initialized = true;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Car" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "make" TEXT NOT NULL,
      "model" TEXT NOT NULL,
      "bodyType" TEXT,
      "price" INTEGER NOT NULL,
      "mileage" REAL,
      "safetyRating" REAL,
      "power" INTEGER,
      "fuelType" TEXT,
      "transmission" TEXT
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Shortlist" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "slug" TEXT NOT NULL,
      "query" TEXT NOT NULL,
      "carIds" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Shortlist_slug_key" ON "Shortlist"("slug");
  `);
}