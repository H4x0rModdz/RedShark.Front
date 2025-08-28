/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      name: string;
      userName: string;
      email: string;
      image: string;
      biography?: string;
      errors?: string[];
      success?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    token: string;
    name: string;
    userName: string;
    email: string;
    image: string;
    biography?: string;
    errors?: string[];
    success?: boolean;
  }
  
  interface JWT {
    id: string;
    token: string;
    name: string;
    userName: string;
    email: string;
    image: string;
    biography?: string;
    errors?: string[];
    success?: boolean;
  }
}