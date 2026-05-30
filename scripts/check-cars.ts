/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.car.count();
  console.log("Car count:", count);
  const sample = await prisma.car.findMany({ take: 5 });
  console.log("Sample cars:", sample);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });