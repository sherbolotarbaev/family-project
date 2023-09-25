import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        firstName: {
          label: "First Name",
          type: "text",
          placeholder: "First Name",
        },

        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials?.firstName || !credentials?.password) return null;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const responseData = await response.json();

          if (response.status === 401) {
            return null;
          }

          if (!responseData) return null;

          return responseData;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],

  secret: `${process.env.NEXTAUTH_SECRET}`,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ session, token, user }) {
      if (user) return { ...token, ...user };

      return token;
    },

    async session({ token, session, user }) {
      session.user = token.user;
      session.tokens = token.tokens;

      return session;
    },
  },
};