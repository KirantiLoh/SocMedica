import { useRouter } from 'next/router'
import React from 'react'
import { useInView } from 'react-cool-inview';
import { FaArrowLeft } from 'react-icons/fa';
import Button from 'src/components/Button';
import Post from 'src/components/Post';
import SearchBar from 'src/components/SearchBar';
import UserCard from 'src/components/UserCard';
import { trpc } from 'src/utils/trpc';

const SearchPage = () => {

  const router = useRouter();
  const { q } = router.query;

  const { data: userList, fetchNextPage: getMoreUsers } = trpc.search.findUsers.useInfiniteQuery({query: q as string, limit: 1}, {
    enabled: !!q,
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor,
  });

  const { data: postList, fetchNextPage: getMorePosts } = trpc.search.findPosts.useInfiniteQuery({query: q as string, limit: 15}, {
    enabled: !!q,
    getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor,
  });

  const { observe } = useInView({
    rootMargin: "100px 0px",
    onEnter: ({unobserve}) => {
      getMorePosts();
      if (!postList?.pages[postList.pages.length - 1]?.nextCursor) {
          unobserve();
      }
    }
  });

  const users = userList?.pages.map((userData, index) => {
    if (userData.users.length > 0) {
      return userData.users.map(user => {
        return (
          <li key={user.id}>
              <UserCard {...user} />
          </li>
        )
      })
    } else {
      return (
        <h2 key={index}>No users found...</h2>
      )
    }
  })

  const posts = postList?.pages.map((postsData, index) => {
    if (postsData.posts.length > 0) {
      return postsData.posts.map(post => {
          return (
              <div key={post.id} ref={observe}>
                <Post likes={post._count.LikedPost ?? 0} {...post} />
              </div>
          )
      })
    } else {
      return (
        <h2 key={index}>No posts found...</h2>
      )
    }
});

  return (
    <main className='overflow-y-auto w-full'>
        <section className="z-[1] flex sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <FaArrowLeft className='cursor-pointer text-2xl' onClick={() => router.back()} />
            <SearchBar />
          </div>
        </section>
      <h1 className="px-3 text-2xl">You searched for: {q}</h1>
      <section className='p-3'>
        <h2 className='text-lg font-semibold mb-2'>Users</h2>
        <ul className='flex gap-3 flex-col'>
          {users}
          { userList?.pages[userList.pages.length - 1]?.nextCursor &&
            <li>
              <Button color='secondary' className='w-max' onClick={() => getMoreUsers()}>
                Find more
              </Button>
            </li>
          }
        </ul>
      </section>
      <section className='p-3'>
        <h2 className='text-lg font-semibold mb-2'>Posts</h2>
        <ul className='flex items-center gap-3 flex-wrap'>
          {posts}
        </ul>      
      </section>
    </main>
  )
}

export default SearchPage