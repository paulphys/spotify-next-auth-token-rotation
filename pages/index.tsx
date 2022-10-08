import { useEffect } from 'react';
import Head from 'next/head';
import { getToken } from 'next-auth/jwt';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import { MySession } from '@/types/types';

interface UseSession {
  data: MySession | null;
  status: any;
}

export default function Home({ toptracks }) {
  const { data: session, status }: UseSession = useSession();
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn('spotify', { callbackUrl: process.env.REDIRECT_URI });
      console.log('help');
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Spotify Next-Auth Token Rotation</title>
      </Head>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn('spotify', { callbackUrl: process.env.REDIRECT_URI })}>
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}

      {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
    </>
  );
}
