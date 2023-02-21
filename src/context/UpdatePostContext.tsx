import { useSession } from 'next-auth/react';
import Image from 'next/image';
import type { Dispatch, ReactNode, SetStateAction, SyntheticEvent } from "react";
import { createContext, useContext, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from 'src/components/Button';
import Emoji from 'src/components/Emoji';
import { trpc } from 'src/utils/trpc';
import { useToast } from './ToastContext';

interface IUpdatePostContext {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    setIsPrivate: Dispatch<SetStateAction<boolean>>;
    setContent: Dispatch<SetStateAction<string>>;
    setPostId: Dispatch<SetStateAction<string>>;
}

const UpdatePostContext = createContext<IUpdatePostContext>({
    showModal: false,
    setShowModal: undefined as unknown as Dispatch<SetStateAction<boolean>>,
    setIsPrivate: undefined as unknown as Dispatch<SetStateAction<boolean>>,
    setContent: undefined as unknown as Dispatch<SetStateAction<string>>,
    setPostId: undefined as unknown as Dispatch<SetStateAction<string>>
});

export const UpdatePostProvider = ({children}: {children: ReactNode}) => {

    const [showModal, setShowModal] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [content, setContent] = useState("");
    const [postId, setPostId] = useState("");

    const { setContent: setMessage, setType, toggle } = useToast();

    const { data: session } = useSession();

    const updatePost = trpc.post.updatePost.useMutation({
        onSuccess: () => {
            setType("success");
            setMessage(`Post updated!`);
            toggle();
        },
        onError: () => {
            setType("error");
            setMessage(`Please try again`);
            toggle();
        }
    });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!content) return;
        updatePost.mutate({id: postId, content: content, isPrivate: isPrivate });
        closeModal();
    }

    const closeModal = () => {
        setPostId("");
        setContent("");
        setShowModal(false);
    }

    const contextValue = {
        showModal,
        setShowModal,
        setPostId,
        setIsPrivate,
        setContent,
    }

    return (
        <UpdatePostContext.Provider value={contextValue}>
            {children}
            <section className={`z-40 text-white fixed top-0 left-0 max-w-[600px] w-full h-screen md:h-max md:w-[600px] md:top-1/2 md:-translate-x-1/2 md:left-1/2 md:-translate-y-1/2 flex flex-col gap-3 p-3 bg-primary-900 rounded-xl transition-all duration-500 origin-bottom md:origin-center ${showModal ? "scale-y-100 md:scale-100" : "scale-y-0 md:scale-0"}`}>
                <FaTimes className='text-2xl cursor-pointer' onClick={() => closeModal()} />
                <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={session?.user?.image as string} alt={session?.user?.name as string} fill />
                    </div>
                    <form onSubmit={handleSubmit} className='flex-1'>
                        <select onChange={e => {
                            if (e.target.value === "true") {
                                setIsPrivate(true);
                            } else {
                                setIsPrivate(false);
                            }
                        }} value={isPrivate ? "true" : "false"} className='mb-3 p-1 px-2 bg-transparent border-2 border-primary rounded-full'>
                            <option className='bg-primary' value="false">Everyone</option>
                            <option className='bg-primary' value="true">Private</option>
                        </select>
                        <textarea cols={30} rows={5} value={content} onChange={e => setContent(e.target.value)} placeholder="Create a post" className="mb-3 bg-transparent resize-none border-b-2 border-primary-100 w-full outline-none placeholder:text-white placeholder:text-opacity-80"></textarea>
                        <Emoji setText={setContent} />
                        <Button disabled={!content} color='primary'>
                            Update
                        </Button>
                    </form>
                </div>
            </section>
            <div className={`${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-black w-full h-screen fixed inset-0 z-30 transition-opacity duration-500 bg-opacity-50`}></div>
        </UpdatePostContext.Provider>
    )
}

export const useUpdatePost = () => useContext(UpdatePostContext)
