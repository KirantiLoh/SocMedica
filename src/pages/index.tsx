import { type NextPage } from "next";
// import { useSession } from "next-auth/react";
import { useInView } from "react-cool-inview";
import Post from "src/components/Post";
import { trpc } from "src/utils/trpc";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";

// import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  // const { data: session } = useSession();

  const { data: postList, fetchNextPage } = trpc.post.getFollowingPosts.useInfiniteQuery({}, {
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor,
    cacheTime: 0,
  });

  const { observe } = useInView({
    rootMargin: "100px 0px",
    onEnter: ({unobserve}) => {
        fetchNextPage();
        if (!postList?.pages[postList.pages.length - 1]?.nextCursor) {
            unobserve();
        }
    }
});

  const posts = postList?.pages.map((postsData, index) => {
    if (postsData.allPosts.length > 0) {
      return postsData.allPosts.map(post => {
          return (
              <div key={post.id} ref={observe}>
                  <Post likes={post._count.LikedPost ?? 0} {...post} />
              </div>
          )
      })
    } else {
      return (
        <h2 key={index}>You didn&apos;t follow anyone...</h2>
      )
    }
})

  return (
      <section className="w-full overflow-y-auto">
        <section className="z-[1] flex sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Home</h1>
        </section>
        <ul className='flex flex-wrap gap-10 p-3'>
            {posts}
        </ul>
      </section>
  );
};

export default Home;

