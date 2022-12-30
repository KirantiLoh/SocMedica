import type { Post as BasePostProps, User } from '@prisma/client';
import Image from 'next/image';
import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { trpc } from 'src/utils/trpc';
import { BsThreeDots } from "react-icons/bs";
import Link from 'next/link';

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

    const toggleLike = trpc.post.toggleLikePost.useMutation({
        onSuccess(data) {
            if (data.message === "Unliked post") {
                setLiked(liked - 1);
            } else {
                setLiked(liked + 1);
            }
        },
    });

    const [liked, setLiked] = useState(likes);

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
        <div className='flex p-1 min-w-[300px] w-full max-w-[300px] gap-4 text-white'>
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
                        <BsThreeDots />
                    </div>
                </div>
                <p className='max-w-prose mb-4'>{content}</p>
                <div className="flex items-center gap-2">
                    <FaHeart 
                        onClick={() => toggleLike.mutate({postId: id})}
                        className={`transition-colors duration-300 md:hover:text-primary-100 ${liked > 0 ? "text-primary" : "text-white"}`} 
                    /> {liked}
                </div>
            </div>
        </div>
    )
}

export default Post
