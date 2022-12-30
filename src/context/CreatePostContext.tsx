import { createContext, useContext, useState } from 'react';
import type { ReactNode , Dispatch, SetStateAction, SyntheticEvent} from "react";
import { useSession } from 'next-auth/react';
import Button from 'src/components/Button';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { trpc } from 'src/utils/trpc';
import Emoji from 'src/components/Emoji';

interface ICreatePostContext {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CreatePostContext = createContext<ICreatePostContext>({
    showModal: false,
    setShowModal: undefined as unknown as Dispatch<SetStateAction<boolean>>
});

export const CreatePostProvider = ({children}: {children: ReactNode}) => {

    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState("");

    const { data: session } = useSession();

    const mutation = trpc.post.createPost.useMutation({

    });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!content) return;
        mutation.mutate({content: content});
        closeModal();
    }

    const closeModal = () => {
        setContent("");
        setShowModal(false);
    }

    const contextValue = {
        showModal,
        setShowModal
    }

    return (
        <CreatePostContext.Provider value={contextValue}>
            <section className={`z-40 text-white fixed top-0 left-0 max-w-[600px] w-full h-screen md:h-max md:w-[600px] md:top-1/2 md:-translate-x-1/2 md:left-1/2 md:-translate-y-1/2 flex flex-col gap-3 p-3 bg-primary-900 rounded-xl transition-all duration-500 origin-bottom md:origin-center ${showModal ? "scale-y-100 md:scale-100" : "scale-y-0 md:scale-0"}`}>
                <FaTimes className='text-2xl cursor-pointer' onClick={() => closeModal()} />
                <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={session?.user?.image as string} alt={session?.user?.name as string} fill />
                    </div>
                    <form onSubmit={handleSubmit} className='flex-1'>
                        <textarea cols={30} rows={5} value={content} onChange={e => setContent(e.target.value)} placeholder="Create a post" className="mb-3 bg-transparent resize-none border-b-2 border-primary-100 w-full outline-none placeholder:text-white placeholder:text-opacity-80"></textarea>
                        <Emoji setText={setContent} />
                        <Button disabled={!content} color='primary'>
                            Create
                        </Button>
                    </form>
                </div>
            </section>
            <div className={`${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-black w-full h-screen fixed inset-0 z-30 transition-opacity duration-500 bg-opacity-50`}></div>
            {children}
        </CreatePostContext.Provider>
    )
}

export const useCreatePost = () => useContext(CreatePostContext)
