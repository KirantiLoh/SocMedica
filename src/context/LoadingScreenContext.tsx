import { createContext, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from "react";
import LoadingScreen from '../components/LoadingScreen';

interface ILoadingScreen {
    showScreen: boolean
    setShowScreen: Dispatch<SetStateAction<boolean>>
}

export const LoadingScreenContext = createContext<ILoadingScreen>({
    showScreen: false,
    setShowScreen: undefined as unknown as Dispatch<SetStateAction<boolean>>
});

export const LoadingScreenProvider = ({children}: {children: ReactNode}) => {

    const [showScreen, setShowScreen] = useState(false);


    const contextValue = {
        showScreen,
        setShowScreen
    }

    return (
        <LoadingScreenContext.Provider value={contextValue}>
            <LoadingScreen />
            {children}
        </LoadingScreenContext.Provider>
    )
}

