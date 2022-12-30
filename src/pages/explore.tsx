import React from 'react'
import { useInView } from 'react-cool-inview';
import Post from 'src/components/Post';
import SearchBar from 'src/components/SearchBar';
import { trpc } from 'src/utils/trpc';

const ExplorePage = () => {

    const { data: postList, fetchNextPage } = trpc.post.getAllPosts.useInfiniteQuery({
        limit: 10
    }, {
        getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor
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

    const posts = postList?.pages.map(postsData => {
        return postsData.allPosts.map(post => {
            return (
                <div key={post.id} ref={observe}>
                  <Post likes={post._count.LikedPost ?? 0} {...post} />
                </div>
            )
        })
    });

    return (
        <main className='w-full h-screen overflow-y-auto'>
            <section className="z-[1] flex sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
                <SearchBar />
            </section>
            <section className="pl-3">
                <h1 className="text-2xl font-bold py-5">Explore</h1>
                <ul className='flex flex-wrap gap-10'>
                    {posts}
                </ul>
            </section>
        </main>
    )
}

export default ExplorePage;
