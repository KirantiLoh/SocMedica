import { signIn, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import { createContext } from 'react';
import LoadingScreen from 'src/components/LoadingScreen';

const AuthContext = createContext({});

export const AuthProvider = ({children}: {children: ReactNode}) => {
  
    const { data: session } = useSession({
      required: true,
      onUnauthenticated: () => {
        signIn("discord", {callbackUrl: "/"});
      },
    });

    // if (!session && status === "unauthenticated") signIn("discord", {callbackUrl: "/"});


    return (
      <AuthContext.Provider value={{}}>
          {session ? children : <LoadingScreen />}
      </AuthContext.Provider>
    )
}
