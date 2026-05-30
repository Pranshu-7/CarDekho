import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/db/ensureSchema";

function generateSlug(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json().catch(() => null);
    if (!body || typeof body.query !== "string" || !Array.isArray(body.carIds)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const query = body.query.trim();
    const carIds = body.carIds as unknown[];

    if (query.length === 0 || query.length > 1000) {
      return NextResponse.json(
        { error: "Query must be between 1 and 1000 characters." },
        { status: 400 }
      );
    }

    const numericIds = carIds
      .map((id) => {
        if (typeof id === "number") return id;
        if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
        return null;
      })
      .filter((id): id is number => id !== null);

    if (numericIds.length === 0) {
      return NextResponse.json({ error: "At least one valid car ID is required." }, { status: 400 });
    }

    const existingCars = await prisma.car.findMany({
      where: {
        id: {
          in: numericIds
        }
      },
      select: { id: true }
    });

    const existingIds = new Set(existingCars.map((c) => c.id));
    const validIds = numericIds.filter((id) => existingIds.has(id));

    if (validIds.length === 0) {
      return NextResponse.json({ error: "No valid car IDs found." }, { status: 400 });
    }

    let slug = generateSlug();
    let attempts = 0;

    while (attempts < 5) {
      const existing = await prisma.shortlist.findUnique({
        where: { slug }
      });
      if (!existing) break;
      slug = generateSlug();
      attempts += 1;
    }

    const carIdsJson = JSON.stringify(validIds);

    await prisma.shortlist.create({
      data: {
        slug,
        query,
        carIds: carIdsJson
      }
    });

    return NextResponse.json({ slug });
  } catch (err) {
    console.error("Error in /api/shortlists", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Something went wrong while saving shortlist.", detail: message },
      { status: 500 }
    );
  }
}