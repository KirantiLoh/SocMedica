import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main =async () => {
    if (!prisma) return;
    const user = await prisma.user.findFirst({
        where: {
            name: "Miranti"
        }
    })
    if (!user) return;
    const amount = [...Array(90).keys()]
    for (const i of amount) {
        await prisma.post.create({
            data: {
                content: `Post ${i}, testing follower feature!`,
                senderId: user.id
            }
        })
    }
}

main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })