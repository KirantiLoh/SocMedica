import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const searchRouter = router({
  findUsers: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 3;
      const users = await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (users.length > limit) {
        const nextUser = users.pop();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextCursor = nextUser?.id;
      }
      return { users, nextCursor };
    }),
  findPosts: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const posts = await ctx.prisma.post.findMany({
        where: {
          content: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              LikedPost: true,
            },
          },
          sender: true,
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextPost = posts.pop();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextCursor = nextPost?.id;
      }
      return { posts, nextCursor };
    }),
});
