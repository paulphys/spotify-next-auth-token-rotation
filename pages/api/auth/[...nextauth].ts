import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scope =
  'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-recently-played user-read-playback-state user-top-read user-read-currently-playing user-follow-read user-read-email user-read-private user-library-read';

async function refreshAccessToken(token) {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const authHeader = process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET;
    const based = Buffer.from(authHeader).toString('base64');
    const body = 'grant_type=refresh_token&refresh_token=' + token.refresh_token;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + based,
      },
      body: body,
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + account.expires_at * 1000;
        token.refresh_token = account.refresh_token;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token;
      session.access_token = token.access_token;
      session.error = token.error;
      return session;
    },
  },
});
