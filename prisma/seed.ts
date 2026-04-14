import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { PRODUCT_CATEGORIES } from "../src/constants/productCategories";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Copy .env.example to .env and set DATABASE_URL.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  let order = 0;
  for (const name of PRODUCT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      create: {
        name,
        sortOrder: order,
        isActive: true,
      },
      update: {
        sortOrder: order,
        isActive: true,
      },
    });
    order += 1;
  }
  console.log(`Seed: ${PRODUCT_CATEGORIES.length} categorias garantidas na tabela Category.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
