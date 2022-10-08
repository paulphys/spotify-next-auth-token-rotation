# Spotify NextAuth Token Rotation
This repository expands the [NextAuth.js Refresh Token Rotation example](https://github.com/nextauthjs/next-auth-refresh-token-example) to Spotify OAuth 2.0.

## Setup

### Spotify API

- [Sign up for a Spotify developer account](https://developer.spotify.com/dashboard)
- Create a new application
- Add `http://localhost:3000/api/auth/callback/spotify` as Redirect URI
- Copy `Client ID` and `Client Secret`

### Develop locally

```bash
git clone https://github.com/paulphys/spotify-next-auth-token-rotation
cd spotify-next-auth-token-rotation
yarn
yarn dev
```

### Environment variables

Create a `.env` file similar to [`.env.example`](https://github.com/paulphys/spotify-next-auth-token-rotation/blob/main/.env.example) in the root of the application and fill in all values.
