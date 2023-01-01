import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import UserCard from 'src/components/UserCard';
import { LoadingScreenContext } from 'src/context/LoadingScreenContext';
import { trpc } from 'src/utils/trpc';

const FollowingPage = () => {

    const router = useRouter();
    const { name } = router.query;

    const { setShowScreen } = useContext(LoadingScreenContext);

    const { data: profile } = trpc.user.getUserProfileByName.useQuery({name: name as string}, {
            enabled: !!name,
            cacheTime: 0,
            onSuccess() {
                setShowScreen(false);
            },
        });

    const { data } = trpc.user.getFollowers.useQuery({id: profile?.id as string}, {
        enabled: !!profile?.id
    });

    useEffect(() => {
        setShowScreen(true);
      }, [setShowScreen]);

    if (profile) {
        return (
          <main className='w-full max-w-[600px]'>
              <section className="z-[1] flex flex-col gap-2 sticky w-full h-max p-3 top-0 left-0 bg-secondary-900 bg-opacity-60 backdrop-blur-sm">
                <aside className="flex items-center gap-2">
                  <FaArrowLeft className='text-2xl cursor-pointer' onClick={() => router.push(`/${name}`)} />
                  <h1 className="text-2xl font-bold">{name}</h1>
                </aside>
                <aside className="flex items-center justify-evenly gap-3">
                    <Link href={`/${name}/following`} className={router.pathname.endsWith("following") ? "relative text-white before:absolute before:w-full before:h-1 before:rounded-2xl before:-bottom-2 before:left-0 before:bg-primary-100" : "opacity-50"}>
                        Following
                    </Link>
                    <Link href={`/${name}/followers`} className={router.pathname.endsWith("followers") ? "relative text-white before:absolute before:w-full before:h-1 before:rounded-2xl before:-bottom-2 before:left-0 before:bg-primary-100" : "opacity-50"}>
                        Followers
                    </Link>
                </aside>
              </section>
            <ul className='p-3 gap-3'>
                {data && data.length > 0 ? data.map(following => {
                    const { user } = following;
                    return (
                        <li key={user.id}>
                            <UserCard {...user} />
                        </li>
                    )
                })
            :
            <h2>This user has no followers</h2>
            }
            </ul>
          </main>
        )
    }
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

export default FollowingPage;