import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from "next-auth";

const authOptions:NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const response = await res.json();
          
          if (response.error) throw response;
  
          // Uso el token para obtener la información del usuario
          if(response.token){
            const account = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${response.token}`,
              },
            });
            const profile = await account.json();
            return { ...response, user:profile }
          }
  
          return response;
        }
        
      })
    ],
    session:{
      strategy: 'jwt',
      maxAge: 24 * 60 * 60,
    },
    callbacks: {
      async jwt({ token, user }: { token: any, user: any }) {
        // Guardamos el token JWT en el objeto token para usar en `session`
        if (user) {
          token.user = user;
          token.token = user.token;
        }
        return token;
      },
      async session({ session, user, token }: { session: any, user: any, token: any }) {
        // Pasamos el objeto usuario y el token a la sesión
    
        session.user = token.user.user;
        session.token = token.token;
        return session;
      }
    },
    pages:{
      signIn:"/login"
    }
  }

  export {authOptions}