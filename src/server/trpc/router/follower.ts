import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const followerRouter = router({
    followUser: protectedProcedure
        .input(z.object({
            otherId: z.string()
        }))
        .mutation(async ({ctx, input}) => {
            const { session, prisma } = ctx;
            try {
                await prisma.follower.create({
                    data: {
                        userId: session.user.id,
                        followingId: input.otherId
                    }
                });
                return {message: "Success!"};
            } catch (error) {
                console.error(error);
                return {message: "Internal server error"};
            }
        }),
    unfollowUser: protectedProcedure
    .input(z.object({
        otherId: z.string()
    }))
    .mutation(async ({ctx, input}) => {
        const { session, prisma } = ctx;
        try {
            const followingInfo = await prisma.follower.findFirst({
                where: {
                    userId: session.user.id,
                    followingId: input.otherId
                }
            });
            if (!followingInfo) throw new Error("No following info was found");
            await prisma.follower.delete({
                where: {
                    id: followingInfo.id
                }
            });
            return {message: "Success!"};
        } catch (error) {
            console.error(error);
            return {message: "Internal server error"};
        }
    }),
})