import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const postRouter = router({
  getUserPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor, id } = input;
      const userPosts = await ctx.prisma.post.findMany({
        take: limit + 1,
        where: {
          senderId: id,
          isPrivate: ctx.session.user.id === input.id ? undefined : false,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: true,
          isPrivate: true,
          _count: {
            select: {
              LikedPost: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (userPosts.length > limit) {
        const nextPost = userPosts.pop();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextCursor = nextPost?.id;
      }
      return { userPosts, nextCursor };
    }),
  getAllPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const allPosts = await ctx.prisma.post.findMany({
        where: {
          isPrivate: false,
        },
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          _count: {
            select: {
              LikedPost: true,
            },
          },
          sender: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (allPosts.length > limit) {
        const nextPost = allPosts.pop();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextCursor = nextPost?.id;
      }
      return { allPosts, nextCursor };
    }),
  getFollowingPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const userData = await ctx.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          following: {
            select: {
              following: {
                select: {
                  posts: {
                    where: {
                      isPrivate: false,
                    },
                    take: limit + 1,
                    orderBy: {
                      createdAt: "desc",
                    },
                    cursor: cursor ? { id: cursor } : undefined,
                    include: {
                      _count: {
                        select: {
                          LikedPost: true,
                        },
                      },
                      sender: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      const nestedPosts = userData?.following.map((follow) => {
        return follow.following.posts.map((post) => post);
      });
      if (!nestedPosts || nestedPosts.length <= 0)
        return { allPosts: [], nextCursor: undefined };
      const allPosts = nestedPosts?.flat(1);
      let nextCursor: typeof cursor | undefined = undefined;
      if (allPosts.length > limit) {
        const nextPost = allPosts.pop();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nextCursor = nextPost?.id;
      }
      return { allPosts, nextCursor };
    }),
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        isPrivate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      try {
        await prisma.post.create({
          data: {
            senderId: session.user.id,
            content: input.content,
            isPrivate: input.isPrivate,
          },
        });
        return { message: "Post created" };
      } catch (error) {
        console.error(error);
        return { message: "Internal Server error" };
      }
    }),
  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        isPrivate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: input.id,
          },
        });
        if (post?.senderId === session.user.id) {
          await prisma.post.update({
            where: {
              id: post.id,
            },
            data: {
              content: input.content,
              isPrivate: input.isPrivate,
            },
          });
          return { message: "Post created" };
        } else {
          return { message: "Post not found" };
        }
      } catch (error) {
        console.error(error);
        return { message: "Internal Server error" };
      }
    }),
  toggleLikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { id: userId } = session.user;
      const liked = await prisma.likedPost.findFirst({
        where: {
          userId: userId,
          postId: input.postId,
        },
      });
      if (liked) {
        await prisma.likedPost.delete({
          where: {
            id: liked.id,
          },
        });
        return { message: "Unliked post" };
      } else {
        await prisma.likedPost.create({
          data: {
            userId: userId,
            postId: input.postId,
          },
        });
        return { message: "Liked post" };
      }
    }),
  deletePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const post = await prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
      if (!post) return { message: "Post not found" };
      if (post.senderId !== session.user.id) return { message: "Unauthorized" };
      await prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
      return { message: "Post deleted!" };
    }),
  reportPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.reportedPost.create({
        data: {
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
      return { message: "Reported post" };
    }),
});
