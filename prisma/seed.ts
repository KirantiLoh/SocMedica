import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = "cle5py9hx0000vn0s2m9tebt2";

  const arr = [...Array(100).keys()];

  console.log("Seeding db...");
  for (const val of arr) {
    await prisma.post.create({
      data: {
        senderId: user,
        content: `Post no ${val}`,
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
