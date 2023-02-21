import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import SideNav from "src/components/SideNav";
import { AuthProvider } from "src/context/AuthContext";
import { ToastProvider } from "src/context/ToastContext";
import { UpdatePostProvider } from "src/context/UpdatePostContext";
import { CreatePostProvider } from "../context/CreatePostContext";
import { LoadingScreenProvider } from "../context/LoadingScreenContext";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <LoadingScreenProvider>
          <ToastProvider>
            <CreatePostProvider>
              <UpdatePostProvider>
                <Head>
                  <title>SocMeDic</title>
                  <meta name="description" content="SocMeDic" />
                  <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="w-full h-screen overflow-hidden flex bg-secondary-900 text-white">
                  <SideNav />
                  <Component {...pageProps} />
                </main>
              </UpdatePostProvider>
            </CreatePostProvider>
          </ToastProvider>
        </LoadingScreenProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
