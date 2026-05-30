/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type KaggleRow = {
  // Adjust property names to match your CSV headers
  make: string;
  model: string;
  body_type?: string;
  price?: string;
  mileage?: string;
  safety_rating?: string;
  power?: string;
  fuel_type?: string;
  transmission?: string;
};

async function main() {
  const csvPath = path.join(process.cwd(), "data", "cars_kaggle.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found at", csvPath);
    console.error("Place your Kaggle CSV as data/cars_kaggle.csv before running this script.");
    process.exit(1);
  }

  console.log("Reading Kaggle CSV from:", csvPath);

  const fileContent = fs.readFileSync(csvPath, "utf-8");

  const records: KaggleRow[] = [];

  await new Promise<void>((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true
      },
      (err, parsed) => {
        if (err) {
          reject(err);
          return;
        }
        records.push(...(parsed as KaggleRow[]));
        resolve();
      }
    );
  });

  console.log(`Parsed ${records.length} rows from CSV.`);

  // Map CSV rows to Prisma Car records
  const carsData = records
    .map((row) => {
      // Adjust parsing logic based on your CSV structure
      const price = row.price ? Number(row.price.toString().replace(/[^0-9.]/g, "")) : undefined;
      const mileage = row.mileage ? Number(row.mileage.toString().replace(/[^0-9.]/g, "")) : undefined;
      const safetyRating = row.safety_rating
        ? Number(row.safety_rating.toString().replace(/[^0-9.]/g, ""))
        : undefined;
      const power = row.power ? Number(row.power.toString().replace(/[^0-9.]/g, "")) : undefined;

      if (!row.make || !row.model || !price) {
        // Skip rows with missing essential data
        return null;
      }

      return {
        make: row.make,
        model: row.model,
        bodyType: row.body_type || null,
        price,
        mileage: mileage ?? null,
        safetyRating: safetyRating ?? null,
        power: power ?? null,
        fuelType: row.fuel_type || null,
        transmission: row.transmission || null
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  console.log(`Mapped ${carsData.length} valid car rows.`);

  if (carsData.length === 0) {
    console.error("No valid car rows found after mapping. Check your CSV column names and parsing logic.");
    process.exit(1);
  }

  console.log("Clearing existing cars and shortlists...");
  await prisma.shortlist.deleteMany();
  await prisma.car.deleteMany();

  console.log("Inserting Kaggle cars into database...");
  await prisma.car.createMany({
    data: carsData
  });

  console.log("Kaggle import completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error importing Kaggle data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });