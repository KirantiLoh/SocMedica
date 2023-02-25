import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // User id
  const user = "clek03v130000vnq8l2m4w39r";

  const arr = [...Array(100).keys()];

  console.log("Seeding db...");
  for (const val of arr) {
    await prisma.post.create({
      data: {
        senderId: user,
        content: `Post no ${val + 1}`,
      },
    });
  }
}

main()
  .then(async () => {
    console.log("Done!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    console.log("Error in seeding");
    await prisma.$disconnect();
    process.exit(1);
  });
