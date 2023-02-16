import { type NextPage } from "next";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-cool-inview";
import Button from "src/components/Button";
import Post from "src/components/Post";
import { LoadingScreenContext } from "src/context/LoadingScreenContext";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {

  const { setShowScreen } = useContext(LoadingScreenContext);

  const [showExplore, setShowExplore] = useState(false);

  const { data: postList, fetchNextPage } = trpc.post.getFollowingPosts.useInfiniteQuery({}, {
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor,
    cacheTime: 0,
    onSuccess: () => setShowScreen(false)
  });

  const { observe } = useInView({
    rootMargin: "100px 0px",
    onEnter: ({unobserve}) => {
        fetchNextPage();
        if (!postList?.pages[postList.pages.length - 1]?.nextCursor) {
          setShowExplore(true);
            unobserve();
        }
    }
});

  const posts = postList?.pages.map((postsData, index) => {
    if (postsData.allPosts.length > 0) {
      return postsData.allPosts.map(post => {
          return (
              <div key={post.id} className="w-full" ref={observe}>
                  <Post likes={post._count.LikedPost ?? 0} {...post} />
              </div>
          )
      })
    } else {
      return (
        <div key={index} className="flex flex-col items-center justify-center w-full">
          <h2 className="font-medium text-lg -mb-5">No posts were found...</h2>
          <Image src="/sad.png" alt="From designs.ai" width={400} height={400} />
          <Button color="secondary" className="w-max px-20 -mt-5" href="/explore">
            Explore
          </Button>
        </div>
      )
    }
});

  useEffect(() => {
    setShowScreen(true);
  }, [setShowScreen])

  return (
      <section className="w-full max-w-[600px] overflow-y-auto">
        <section className="z-[1] flex sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Home</h1>
        </section>
        <section className="p-3 sm:px-5 py-8">
          <ul className='flex flex-wrap gap-10'>
              {posts}
          </ul>
          {showExplore ? 
            <Button color="secondary" className="w-max px-20 mx-auto" href="/explore">
              Explore
          </Button>
            :
            null
          }
        </section>
      </section>
  );
};

export default Home;

