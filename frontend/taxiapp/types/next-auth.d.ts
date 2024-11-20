import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      lastname: string;
      username: string;
      email: string;
      phone: string;
      roles: Array<{ id: number; name: string }>;
      is_disabled: boolean | null;
      
    };
    token: any;
  }
  interface User {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    roles: Array<{ id: number; name: string }>;
    is_disabled: boolean | null;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    token: string;
  }
}