/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from "axios";
import Credentials from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { AuthOptions } from "next-auth";
import UserService from "@/services/AuthService";

const sevenDays = 7 * 24 * 60 * 60;
const oneDay = 24 * 60 * 60;
const maxAge = process.env.NODE_ENV === "production" ? oneDay : sevenDays;

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "string" },
        password: { label: "Password", type: "string" },
      },
      async authorize(credentials, _req) {
        try {
          const { token, errors, success } =
            await UserService.Login(
                {
                    email: credentials!.email,
                    password: credentials!.password
                }
            );
          return {
            id: crypto.randomUUID(),
            token: token,
            errors: errors,
            success: success,
          };
        } catch (error) {
          if (isAxiosError(error)) {
            const errorToThrow =
              error.response?.data?.map((error: string) => error).join("\n") ??
              "Erro Interno do Servidor";
            throw new Error(errorToThrow);
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: oneDay,
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/",
    signOut: "/login",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);

export const GetSession = (): any => {
  if (typeof window === "undefined") return getServerAuthSession();
  return getSession();
};

export const createRequestAuthObj = async () => {
  const session = await GetSession();
  if (!session) return {};
  return {
    headers: {
      Authorization: `Bearer ${session.user.token ?? session.user?.token}`,
    },
  };
};