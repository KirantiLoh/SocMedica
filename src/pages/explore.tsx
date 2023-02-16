import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { useInView } from 'react-cool-inview';
import Button from 'src/components/Button';
import Post from 'src/components/Post';
import SearchBar from 'src/components/SearchBar';
import { useCreatePost } from 'src/context/CreatePostContext';
import { LoadingScreenContext } from 'src/context/LoadingScreenContext';
import { trpc } from 'src/utils/trpc';

const ExplorePage = () => {

    const { setShowScreen } = useContext(LoadingScreenContext);

    const { setShowModal } = useCreatePost();

    const { data: postList, fetchNextPage } = trpc.post.getAllPosts.useInfiniteQuery({
        limit: 10
    }, {
        getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor,
        cacheTime: 0,
        onSuccess: () => setShowScreen(false)
    })

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
              <Button color="secondary" className="w-max px-20 -mt-5" onClick={() => setShowModal(true)}>
                Create Post
              </Button>
            </div>
          )
        }
    });

    useEffect(() => {
        setShowScreen(true);
      }, [setShowScreen])

    return (
        <main className='w-full max-w-[600px] h-screen overflow-y-auto'>
            <section className="z-[1] flex sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
                <SearchBar />
            </section>
            <section className="p-3 sm:px-5">
                <h1 className="text-2xl font-bold mb-5">Explore</h1>
                <ul className='flex flex-wrap gap-10'>
                    {posts}
                </ul>
            </section>
        </main>
    )
}

export default ExplorePage;
