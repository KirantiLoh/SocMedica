import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import SideNav from "src/components/SideNav";
import { LoadingScreenProvider } from "../context/LoadingScreenContext";
import { CreatePostProvider } from "../context/CreatePostContext";
import { AuthProvider } from "src/context/AuthContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <LoadingScreenProvider>
          <CreatePostProvider>
            <Head>
              <title>SocMeDic</title>
              <meta name="description" content="SocMeDic" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="w-full h-screen overflow-hidden flex bg-secondary-900 text-white">
              <SideNav />
              <Component {...pageProps} />
            </main>
          </CreatePostProvider>
        </LoadingScreenProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
