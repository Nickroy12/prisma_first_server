import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";

async function main() {
  try {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    const prisma = new PrismaClient({ adapter });
    const products = await prisma.product.findMany({ where: { isDeleted: false } });
    console.log(products);
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
