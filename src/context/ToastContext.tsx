import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FaThumbsUp, FaTimes } from 'react-icons/fa';
import { IoMdWarning } from "react-icons/io";

interface IToastContext {
    showToast: boolean;
    setShowToast: Dispatch<SetStateAction<boolean>>;
    content: string;
    setContent: Dispatch<SetStateAction<string>>;
    type: "success" | "error";
    setType: Dispatch<SetStateAction<"success" | "error">>;
    toggle: () => void
}

const ToastContext = createContext<IToastContext>({
    showToast: false,
    setShowToast: undefined as unknown as Dispatch<SetStateAction<boolean>>,
    content: "",
    setContent: undefined as unknown as Dispatch<SetStateAction<string>>,
    type: "success",
    setType: undefined as unknown as Dispatch<SetStateAction<"success" | "error">>,
    toggle: undefined as unknown as () => void,
});

export const ToastProvider = ({children}: {children: ReactNode}) => {

    const [showToast, setShowToast] = useState(false);
    const [content, setContent] = useState("");
    const [type, setType] = useState<"success" | "error">("success");

    const closeModal = () => {
        setContent("");
        setShowToast(false);
    }

    const handler = useRef<ReturnType<typeof window.setTimeout>>();
      
      const toggle = () => {
          setShowToast(true);
          if (handler.current) clearTimeout(handler.current);
          handler.current = setTimeout(() => {
              closeModal();
          }, 2000);
      }
  
      useEffect(() => {
  
          return () => {
              clearTimeout(handler.current);
          }
      }, [])

    const contextValue = {
        showToast,
        setShowToast,
        content,
        setContent,
        type, 
        setType,
        toggle,
    }

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <section className={`z-40 flex items-center justify-between text-white fixed bottom-0 sm:bottom-5 bg-primary w-full sm:w-[300px] p-3 rounded transition-all sm:duration-500 ${showToast ? "right-0 sm:right-5" : "-right-full"}`}>
                <h3 className="text-xl">
                    {type === "success" ? <FaThumbsUp /> : <IoMdWarning />}
                </h3>
                <h3 className="text-lg">{content}</h3>
                <FaTimes className='text-2xl cursor-pointer' onClick={() => closeModal()} />
            </section>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
