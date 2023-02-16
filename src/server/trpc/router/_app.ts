import { router } from "../trpc";
import { followerRouter } from "./follower";
import { postRouter } from "./post";
import { searchRouter } from "./search";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  follower: followerRouter,
  search: searchRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
