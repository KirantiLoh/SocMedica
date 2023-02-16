import type { Post as BasePostProps, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaFlag, FaHeart, FaTrashAlt, FaUserPlus, FaUserTimes } from 'react-icons/fa';
import { useToast } from 'src/context/ToastContext';
import { trpc } from 'src/utils/trpc';

interface PostProps extends Omit<BasePostProps, "senderId"> {
    likes: number
    sender: User
}

const Post = ({
    content,
    createdAt,
    sender,
    likes,
    id
}: PostProps) => {

    const postRef = useRef<HTMLDivElement>(null);

    const { setContent, setType, toggle } = useToast();

    const toggleLike = trpc.post.toggleLikePost.useMutation({
        onSuccess(data) {
            if (data.message === "Unliked post") {
                setLiked(liked - 1);
            } else {
                setLiked(liked + 1);
            }
        },
    });

    const deletePost = trpc.post.deletePost.useMutation({
        onSuccess: () => postRef.current?.remove()
    });

    const { data: isFollowing, refetch } = trpc.user.getFollowingInfo.useQuery({
        followingId: sender.id
    })

    const followUser = trpc.follower.followUser.useMutation({
        onSuccess: () => {
            setType("success");
            setContent(`Followed ${sender.name}`);
            toggle();
            refetch();
        },
        onError: () => {
            setType("error");
            setContent(`Please try again`);
            toggle();
        }
    });

    const unfollowUser = trpc.follower.unfollowUser.useMutation({
        onSuccess: () => {
            setType("success");
            setContent(`Unfollowed ${sender.name}`);
            toggle();
            refetch();
        },
        onError: () => {
            setType("error");
            setContent(`Please try again`);
            toggle();
        }
    });

    const reportPost = trpc.post.reportPost.useMutation({
        onSuccess: () => {
            setType("success");
            setContent(`Report successful`);
            toggle();
            postRef.current?.remove();
        },
        onError: () => {
            setType("error");
            setContent(`Please try again`);
            toggle();
        }
    })

    const { data: session } = useSession();

    const [liked, setLiked] = useState(likes);
    const [showSettings, setShowSettings] = useState(false);

    const settingsRef = useRef<HTMLUListElement>(null);

    const formatDate = (date: Date) => {
        const diff = Math.abs(new Date().getTime() - date.getTime());
        let publish;
        if(diff > (1000*60*60*24*30)){
            publish = date.toLocaleDateString()
        }else if(diff > (1000*60*60*24)){
            publish = `${Math.floor(diff/(1000*60*60*24))}d`
        }else if(diff > (1000*60*60)){
            publish = `${Math.floor(diff/(1000*60*60))}h`
        }else if(diff > (1000*60)){
            publish = `${Math.floor(diff/(1000*60))}m`
        }else{
            publish = `${Math.floor(diff/(1000))}s`
        }
        return publish;
    }

    return (
        <div ref={postRef} className='relative flex p-1 min-w-[300px] w-full  gap-4 text-white'>
            <Link href={`/${sender.name}`} className="w-[40px] h-[40px] relative">
                <Image src={sender.image || ""} alt="" fill className="rounded-full transition-all duration-300 hover:brightness-75" />
            </Link>
            <div className='flex-1'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className='text-lg font-semibold transition-all duration-300 text-white hover:text-primary-100'>
                            <Link href={`/${sender.name}`} className="">
                                {sender.name}
                            </Link>
                        </h1>
                        <p>·</p>
                        <p>{formatDate(createdAt)}</p>
                    </div>
                    <div>
                        <BsThreeDots className='cursor-pointer' onClick={() => setShowSettings(true)} />
                    </div>
                </div>
                <p className='max-w-prose mb-4'>{content}</p>
                <div className="flex items-center gap-2">
                    <FaHeart 
                        onClick={() => toggleLike.mutate({postId: id})}
                        className={`cursor-pointer transition-colors duration-300 md:hover:text-primary-100 ${liked > 0 ? "text-primary" : "text-white"}`} 
                    /> {liked}
                </div>
            </div>
            <ul ref={settingsRef} className={`${showSettings ? "scale-y-100" : "scale-y-0"} z-[1] origin-top transition-transform duration-500 absolute top-3 right-3 p-2 bg-primary-900 rounded-lg`}>
                {sender.id !== session?.user?.id && (isFollowing  ?
                    <li onClick={() => unfollowUser.mutate({otherId: sender.id})} className='cursor-pointer flex items-center gap-2 transition-colors hover:text-primary-100 p-2'>
                        <FaUserTimes /> Unfollow {sender.name}
                    </li>
                    :
                    <li onClick={() => followUser.mutate({otherId: sender.id})} className='cursor-pointer flex items-center gap-2 transition-colors hover:text-primary-100 p-2'>
                        <FaUserPlus /> Follow {sender.name}
                    </li>)
                }
                {sender.id === session?.user?.id ?
                    <li onClick={() => deletePost.mutate({postId: id})} className='cursor-pointer flex items-center gap-2 transition-colors hover:text-red-600 p-2'>
                        <FaTrashAlt /> Delete
                    </li>
                    :
                    <li onClick={() => reportPost.mutate({postId: id})} className='cursor-pointer flex items-center gap-2 transition-colors hover:text-red-600 p-2'>
                        <FaFlag /> Report
                    </li>
                }
            </ul>
            <div className={`fixed w-full h-screen inset-0 ${showSettings ? "pointer-events-auto" : "pointer-events-none"}`} onClick={() => setShowSettings(false)}></div>
        </div>
    )
}

export default Post

// Tonton video prof menaldi buat laporan, diringkas 500 - 1000 kata
// Refleksi kan video prof menaldi penerapannya pada kehidupan sehari2