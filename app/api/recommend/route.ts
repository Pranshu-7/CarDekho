import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIntent } from "@/lib/recommendation/parseIntent";
import { scoreCars } from "@/lib/recommendation/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.query !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const query = body.query.trim();
    if (query.length === 0 || query.length > 1000) {
      return NextResponse.json(
        { error: "Query must be between 1 and 1000 characters." },
        { status: 400 }
      );
    }

    const intent = await getIntent(query);

    if (typeof body.minBudget === "number") {
      intent.minBudget = body.minBudget;
    }
    if (typeof body.maxBudget === "number") {
      intent.maxBudget = body.maxBudget;
    }

    let cars = await prisma.car.findMany();

    // Optional: auto-seed minimal data in production if DB is empty
    if (cars.length === 0) {
      await prisma.car.createMany({
        data: [
          {
            make: "Maruti",
            model: "Swift",
            bodyType: "Hatchback",
            price: 700000,
            mileage: 21.0,
            safetyRating: 3.0,
            power: 89,
            fuelType: "Petrol",
            transmission: "Manual"
          },
              {
      make: "Maruti",
      model: "Baleno",
      bodyType: "Hatchback",
      price: 850000,
      mileage: 22.0,
      safetyRating: 3.5,
      power: 89,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Hyundai",
      model: "i20",
      bodyType: "Hatchback",
      price: 900000,
      mileage: 20.0,
      safetyRating: 4.0,
      power: 99,
      fuelType: "Petrol",
      transmission: "Automatic"
    },
    {
      make: "Hyundai",
      model: "Creta",
      bodyType: "SUV",
      price: 1500000,
      mileage: 17.0,
      safetyRating: 4.5,
      power: 138,
      fuelType: "Diesel",
      transmission: "Automatic"
    },
    {
      make: "Tata",
      model: "Nexon",
      bodyType: "SUV",
      price: 1200000,
      mileage: 18.0,
      safetyRating: 5.0,
      power: 118,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Tata",
      model: "Altroz",
      bodyType: "Hatchback",
      price: 800000,
      mileage: 19.0,
      safetyRating: 5.0,
      power: 88,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Honda",
      model: "City",
      bodyType: "Sedan",
      price: 1400000,
      mileage: 18.0,
      safetyRating: 4.5,
      power: 119,
      fuelType: "Petrol",
      transmission: "Automatic"
    },
    {
      make: "Honda",
      model: "Amaze",
      bodyType: "Sedan",
      price: 900000,
      mileage: 19.0,
      safetyRating: 4.0,
      power: 89,
      fuelType: "Diesel",
      transmission: "Manual"
    },
    {
      make: "Toyota",
      model: "Glanza",
      bodyType: "Hatchback",
      price: 850000,
      mileage: 21.0,
      safetyRating: 4.0,
      power: 88,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Toyota",
      model: "Innova Crysta",
      bodyType: "MPV",
      price: 2300000,
      mileage: 15.0,
      safetyRating: 4.5,
      power: 147,
      fuelType: "Diesel",
      transmission: "Manual"
    },
    {
      make: "Volkswagen",
      model: "Polo",
      bodyType: "Hatchback",
      price: 1000000,
      mileage: 18.0,
      safetyRating: 4.5,
      power: 108,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Volkswagen",
      model: "Taigun",
      bodyType: "SUV",
      price: 1600000,
      mileage: 17.0,
      safetyRating: 5.0,
      power: 148,
      fuelType: "Petrol",
      transmission: "Automatic"
    },
    {
      make: "Skoda",
      model: "Kushaq",
      bodyType: "SUV",
      price: 1700000,
      mileage: 17.0,
      safetyRating: 5.0,
      power: 148,
      fuelType: "Petrol",
      transmission: "Automatic"
    },
    {
      make: "Mahindra",
      model: "XUV700",
      bodyType: "SUV",
      price: 2000000,
      mileage: 15.0,
      safetyRating: 5.0,
      power: 197,
      fuelType: "Diesel",
      transmission: "Automatic"
    },
    {
      make: "Mahindra",
      model: "Thar",
      bodyType: "SUV",
      price: 1500000,
      mileage: 13.0,
      safetyRating: 4.0,
      power: 150,
      fuelType: "Diesel",
      transmission: "Manual"
    },
    {
      make: "Kia",
      model: "Seltos",
      bodyType: "SUV",
      price: 1600000,
      mileage: 17.0,
      safetyRating: 4.5,
      power: 138,
      fuelType: "Petrol",
      transmission: "Automatic"
    },
    {
      make: "Kia",
      model: "Sonet",
      bodyType: "SUV",
      price: 1100000,
      mileage: 18.0,
      safetyRating: 4.0,
      power: 118,
      fuelType: "Diesel",
      transmission: "Manual"
    },
    {
      make: "Renault",
      model: "Kwid",
      bodyType: "Hatchback",
      price: 500000,
      mileage: 22.0,
      safetyRating: 2.5,
      power: 67,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Nissan",
      model: "Magnite",
      bodyType: "SUV",
      price: 900000,
      mileage: 18.0,
      safetyRating: 4.0,
      power: 99,
      fuelType: "Petrol",
      transmission: "Manual"
    },
    {
      make: "Hyundai",
      model: "Verna",
      bodyType: "Sedan",
      price: 1400000,
      mileage: 18.0,
      safetyRating: 4.0,
      power: 113,
      fuelType: "Petrol",
      transmission: "Automatic"
    }
          // You can add more seed cars here if you want
        ]
      });
      cars = await prisma.car.findMany();
    }

    const filtered = cars.filter((car) => {
      if (intent.maxBudget != null && car.price > intent.maxBudget) return false;
      if (intent.minBudget != null && car.price < intent.minBudget) return false;
      return true;
    });

    const scored = scoreCars(filtered.length > 0 ? filtered : cars, intent, 10);

    return NextResponse.json({
      cars: scored,
      intent
    });
  } catch (err) {
    console.error("Error in /api/recommend", err);
  // TEMP: expose error message in response for debugging on Vercel
  const message =
    err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json(
    { error: "Something went wrong while generating recommendations.", detail: message },
    { status: 500 }
    );
  }
}