import Image from 'next/image';
import { useContext } from 'react';
import { LoadingScreenContext } from '../context/LoadingScreenContext';

const LoadingScreen = () => {

    const { showScreen } = useContext(LoadingScreenContext);

    return (
        <div className={`z-30 fixed top-0 left-0 w-full h-screen bg-primary-gradient flex flex-col items-center justify-center transition-opacity duration-500 ${showScreen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
            <h1 className="text-4xl md:text-6xl text-white font-semibold">SocMedica</h1>
            <Image src="/spinner.svg" alt="" width={100} height={100} />
        </div>
    )
}

export default LoadingScreen
