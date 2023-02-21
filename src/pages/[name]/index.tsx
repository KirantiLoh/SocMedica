import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SyntheticEvent } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { FaCalendarAlt } from 'react-icons/fa';
import Button from 'src/components/Button';
import Post from 'src/components/Post';
import { useCreatePost } from 'src/context/CreatePostContext';
import { LoadingScreenContext } from 'src/context/LoadingScreenContext';
import { useToast } from 'src/context/ToastContext';
import { trpc } from 'src/utils/trpc';
    
const ProfilePage = () => {

    const router = useRouter();
    const { name } = router.query;
    const { setShowScreen } = useContext(LoadingScreenContext);

    const { setShowModal } = useCreatePost();

    const { setContent, setType, toggle } = useToast();

    const { data: session } = useSession();

    const { data: profile, isLoading, refetch: refetchProfile } = trpc.user.getUserProfileByName.useQuery({name: name as string}, {
        enabled: !!name,
        cacheTime: 0,
        onSuccess() {
            setShowScreen(false);
        },
    })

    const { data: postList, fetchNextPage } = trpc.post.getUserPost.useInfiniteQuery({
        id: profile ? profile.id : "",
        // limit: 1
    }, {
        enabled: !!profile?.id,
        cacheTime: 0,
        getNextPageParam: (lastPage, allPages) => lastPage.nextCursor ? lastPage.nextCursor : allPages[allPages.length - 1]?.nextCursor
    });

    const { data: isFollowing, refetch: refetchFollowingStatus } = trpc.user.getFollowingInfo.useQuery({followingId: profile?.id as string}, {
        enabled: !!profile?.id,
        cacheTime: 0,
    });

    const follow = trpc.follower.followUser.useMutation({
        onSuccess() {
            setType("success");
            setContent(`Followed ${profile?.name}`);
            toggle();
            refetchProfile();
            refetchFollowingStatus();
        },
        onError: () => {
            setType("error");
            setContent(`Please try again`);
            toggle();
        }
    });

    const unfollow = trpc.follower.unfollowUser.useMutation({
        onSuccess() {
            setType("success");
            setContent(`Unfollowed ${profile?.name}`);
            toggle();
            refetchProfile();
            refetchFollowingStatus();
        },
        onError: () => {
            setType("error");
            setContent(`Please try again`);
            toggle();
        }
    });

    const [isHovering, setIsHovering] = useState(false);
    
    const { observe } = useInView({
        rootMargin: "100px 0px",
        onEnter: ({unobserve}) => {
            fetchNextPage();
            if (!postList?.pages[postList.pages.length - 1]?.nextCursor) {
                unobserve();
            }
        }
    })

    const handleClick = (e: SyntheticEvent | undefined) => {
        e?.preventDefault();
        if (!profile?.id) return;
        if (!isFollowing) {
            follow.mutate({otherId: profile.id});
        } else {
            unfollow.mutate({otherId: profile.id});
        }
    }
    
    const posts = postList?.pages.map(postData => {
        return postData.userPosts.map(post => {
            return (
                <div key={post.id} className="w-full" ref={observe}>
                  <Post likes={post._count.LikedPost ?? 0} {...post} />
                </div>
            )
        })
    })

    useEffect(() => {
        setShowScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.name])

    // max-w-[600px]
    if (profile) {
        return (
            <section className='flex flex-col gap-4 p-3 sm:p-5 max-w-[600px] w-full overflow-y-scroll'>
                <aside className='flex flex-col gap-5'>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-2'>
                            <div className="relative w-12 h-12 md:w-16 md:h-16">
                                <Image src={profile.image || ""} alt="" fill className="rounded-full" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-medium">{profile.name}</h1>
                                <span className='text-gray-400'>
                                    {profile._count.posts} Posts
                                </span>
                            </div>
                        </div>
                        <div>
                            {
                                session?.user?.id === profile.id ?
                                <>
                                {/* <Button color='secondary' className='text-base'> */}
                                    {/* Edit Profile */}
                                {/* </Button>   */}
                                </>
                                :
                                (!isFollowing ?
                                    <Button onClick={handleClick} color='secondary' className='text-base'>
                                        Follow
                                    </Button> 
                                    :
                                    <Button onClick={handleClick} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}  color='secondary' className='text-base'>
                                        {
                                            !isHovering ? "Following" : "Unfollow"
                                        }
                                    </Button>  
                                ) 
                            }
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        <p className='flex items-center gap-2'>
                            <FaCalendarAlt /> Joined {profile.createdAt.toLocaleDateString()}
                        </p>
                        <ul className="flex flex-wrap gap-5 items-center">
                            <li>
                                {profile._count.following} 
                                <Link href={`/${name}/following`} className='hover:underline underline-offset-4 text-gray-400 ml-1 transition-colors hover:text-primary-100'>
                                    Following
                                </Link>
                            </li>
                            <li>
                                {profile._count.followers} 
                                <Link href={`/${name}/followers`} className='hover:underline underline-offset-4 text-gray-400 ml-1 transition-colors hover:text-primary-100'>
                                    Followers
                                </Link>
                            </li>
                            <li>
                                
                            </li>
                        </ul>
                    </div>
                </aside>
                    {!isLoading &&
                     postList?.pages &&
                     postList.pages[0]?.userPosts &&
                     postList.pages[0].userPosts.length > 0 ?
                        <aside>
                            <h2 className='text-2xl font-semibold mb-2'>Posts</h2>
                            <ul className='flex flex-wrap gap-10'>
                                {posts}
                            </ul>
                        </aside>
                        :
                        <div className="flex flex-col items-center justify-center w-full">
                          <h2 className="font-medium text-lg -mb-5">{profile.name} didn&apos;t post anything...</h2>
                          <Image src="/sad.png" alt="From designs.ai" width={400} height={400} />
                          {session?.user?.id === profile.id ?
                          <Button color="secondary" className="w-max px-20 -mt-5" onClick={() => setShowModal(true)}>
                            Create Post
                          </Button>
                          : null}
                        </div>
                    }
            </section>
        )
    }
    else if (!isLoading  && !profile) {
    return (
        <section className='flex flex-col gap-4 p-3'>
            <aside className='flex items-center gap-2'>
                <div className="rounded-full bg-primary-900 bg-opacity-50" />
                <h1 className="text-3xl font-medium">{name}</h1>
            </aside>
            <aside>
                <h2 className='text-2xl font-semibold mb-2'>This account doesn&apos;t exist</h2>
            </aside>
        </section>
    )
    }
    return <></>
}

export default ProfilePage;
