import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined to run the seed script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // console.log("Début du peuplement de la base...");

  const defaultTypes = [
    { label: "Congé", color: "#2563eb" },
    { label: "Ecole", color: "#16a34a" },
    { label: "Astreinte", color: "#ef4444" },
    { label: "Malade", color: "#ffa200" },
  ];

  for (const type of defaultTypes) {
    await prisma.eventType.upsert({
      where: { label: type.label },
      update: {},
      create: { label: type.label, color: type.color },
    });
  }

  console.log("Types d'absences insérés avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });