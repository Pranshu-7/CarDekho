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

    // If client explicitly passed min/max budget, let that override parsed values
    if (typeof body.minBudget === "number") {
      intent.minBudget = body.minBudget;
    }
    if (typeof body.maxBudget === "number") {
      intent.maxBudget = body.maxBudget;
    }

    const cars = await prisma.car.findMany();

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
    return NextResponse.json(
      { error: "Something went wrong while generating recommendations." },
      { status: 500 }
    );
  }
}