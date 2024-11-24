import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { authOptions } from "./authOptions";




const handler = NextAuth(authOptions)


export { handler as GET, handler as POST };
