import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
    getUserProfileByName: protectedProcedure
        .input(z.object({
            name: z.string(),
        }))
        .query(async ({ctx, input}) => {
            const userData = await ctx.prisma.user.findFirst({
                where: {
                    name: input.name,
                },
                select: {
                    id: true,
                    image: true,
                    name: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                            posts: true
                        }
                    },
                    createdAt: true
                    // createdAt: true
                }
            })
            return userData;
        }),
        getFollowingInfo: protectedProcedure
            .input(z.object({
                followingId: z.string()
            }))
            .query(async ({ctx, input}) => {
                const { prisma, session } = ctx;
                const followed = await prisma.follower.findFirst({
                    where: {
                        userId: session.user.id,
                        followingId: input.followingId
                    }
                });
                if (followed) {
                    return true;
                }
                return false;
            }),
        getFollowing: protectedProcedure
            .input(z.object({
                id: z.string()
            }))
            .query(async ({ctx, input}) => {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.id
                    },
                    include: {
                        following: {
                            select: {
                                following: true
                            }
                        }
                    }
                })
                if (user?.following) return user.following;
                return [];
            }),
        getFollowers: protectedProcedure
            .input(z.object({
                id: z.string()
            }))
            .query(async ({ctx, input}) => {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.id
                    },
                    include: {
                        followers: {
                            select: {
                                user: true
                            }
                        }
                    }
                })
                console.log(user?.followers)
                if (user?.followers) return user.followers;
                return [];
            }),
})
