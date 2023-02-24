import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from "react";
import { useEffect, useState } from 'react';
import { FaCompass, FaHome, FaPen, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useCreatePost } from 'src/context/CreatePostContext';
import Button from './Button';

const NavLink = ({children, href}: {href: string, children: ReactNode}) => {
    return (
        <Link href={href} className='flex items-center gap-1.5 text-2xl md:text-xl transition-opacity duration-300 hover:opacity-80'>
            {children}
        </Link>
    )
}

const SideNav = () => {

    const { data: session } = useSession();

    const { setShowModal } = useCreatePost();

    const [showSideNav, setShowSideNav] = useState(false)
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        let startPos: number, endPos: number;
        window.addEventListener("touchstart", (e) => {
            startPos = e.changedTouches[0]?.clientX as number;
        });
        window.addEventListener("touchend", (e) => {
            endPos = e.changedTouches[0]?.clientX as number;
            if (endPos - startPos > 135) {
                setShowSideNav(true);
            } else if (endPos - startPos < -135) {
                setShowSideNav(false);
            }
        });
    }, [])

    return (
        <nav className={`z-20 bg-primary-900 h-screen transition-all duration-500 top-0 ${showSideNav ? "left-0" : "left-[-150%]"} w-full fixed xs:static xs:w-max md:w-[200px] px-1 md:px-5 py-9 xs:py-4 text-white flex flex-col items-center justify-between gap-5`}>
            <h1 onClick={() => setShowSideNav(false)} className='text-4xl xs:text-2xl font-semibold'>
                <Link href="/" className='flex items-center gap-3'>
                    <div className="relative w-[45px] aspect-square">
                        <Image src="/SocMeDic.png" fill alt="SocMedica" />
                    </div>
                     <span className='block xs:hidden md:block'>SocMedica</span>     
                </Link>
            </h1>
            <ul onClick={() => setShowSideNav(false)} className='flex flex-col items-center justify-center gap-7'>
                <li>
                    <NavLink href='/'>
                        <FaHome /> <span className='block xs:hidden md:block'>Home</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink href='/explore'>
                        <FaCompass /> <span className='block xs:hidden md:block'>Explore</span>
                    </NavLink>
                </li>
                {session && session.user ?
                    <>
                        <li>
                            <NavLink href={`/${session.user.name}`}>
                                <FaUser /> <span className='block xs:hidden md:block'>Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <Button color='primary' onClick={() => setShowModal(true)} className='aspect-auto xs:aspect-square md:aspect-auto'>
                                <FaPen /> <span className='block xs:hidden md:block'>Create Post</span>
                            </Button>
                        </li>
                    </>
                    :
                    <li>
                        <Button color='primary' className='' onClick={() => signIn("discord")}>
                            <FaSignInAlt /> Sign in
                        </Button>
                    </li>
                }
            </ul>
            {session && session.user &&
            <aside onClick={() => setShowSettings(!showSettings)} className='cursor-pointer relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 bg-primary bg-opacity-0 hover:bg-opacity-50'>
                <div className="relative w-[32px] aspect-square">
                    <Image src={session.user.image as string} alt="" fill className="rounded-full" />
                </div>
                <h1 className="text-xl font-medium block xs:hidden md:block">{session.user.name}</h1>
                <ul className={`rounded-lg px-4 py-3 w-full absolute transition-transform duration-300 origin-bottom ${showSettings ? "scale-y-100" : "scale-y-0"} -top-[110%] left-0 bg-primary`}>
                    <li onClick={() => signOut()} className='flex items-center justify-center'>
                        <FaSignOutAlt /> Sign out
                    </li>
                </ul>
            </aside>}
        </nav>
    )
}

export default SideNav;
