import { DefaultSession } from 'next-auth';

interface MyUser {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;
}

export interface MySession extends Omit<DefaultSession, 'user'> {
  user?: MyUser;
  expires: string;
}

interface Image {
  height: number | null;
  url: string | null;
  width: number | null;
}
