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
          const loginResult = await UserService.Login({
            email: credentials!.email,
            password: credentials!.password
          });
          
          return {
            id: loginResult.id.toString(),
            token: loginResult.token,
            name: loginResult.name,
            userName: loginResult.userName,
            email: loginResult.email,
            image: loginResult.profileImageUrl,
            biography: loginResult.biography,
            errors: loginResult.errors,
            success: loginResult.success,
          };
        } catch (error) {
          console.error('Login error details:', error);
          
          if (isAxiosError(error)) {
            console.error('Axios error details:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              url: error.config?.url,
              baseURL: error.config?.baseURL
            });

            let errorMessage = "Erro de conexão com o servidor";
            
            if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
              errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em https://localhost:7080.";
            } else if (error.code === 'ECONNRESET') {
              errorMessage = "Conexão interrompida pelo servidor. Verifique a configuração de CORS no backend.";
            } else if (error.message?.includes('certificate') || error.message?.includes('SSL')) {
              errorMessage = "Erro de certificado SSL. Aceite o certificado do backend em https://localhost:7080 no navegador.";
            } else if (error.response?.status === 401) {
              errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
            } else if (error.response?.status === 500) {
              errorMessage = "Erro interno do servidor.";
            } else if (error.response?.data) {
              if (Array.isArray(error.response.data)) {
                errorMessage = error.response.data.map((err: string) => err).join("\n");
              } else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              }
            }
            
            throw new Error(errorMessage);
          }
          
          throw new Error("Erro inesperado durante o login");
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
      // When user logs in, merge all user data into token
      if (user) {
        return {
          ...token,
          ...user,
          // Explicitly map the fields to ensure they're preserved
          id: user.id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          image: user.image,
          biography: user.biography,
          token: user.token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Map token data to session.user
      session.user = {
        ...token,
        id: token.id,
        name: token.name,
        userName: token.userName,
        email: token.email,
        image: token.image,
        biography: token.biography,
        token: token.token,
      } as any;
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