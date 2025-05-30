import "next-auth";
import type { DefaultSession } from "next-auth";

declare module 'next-auth'{
     interface User{
        _id?: string;
        email: string;
        isverified?: boolean;
        name?: string;
        role?: "user" | "admin";
        profilePic?: string;
        password?: string;
     }
}

declare module "next-auth" {
    interface Session {
      user: {
        _id?: string;
        email?: string;
        isverified?: boolean;
        name?: string;
        role?: "user" | "admin";
        profilePic?: string;
        password?: string;
      } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    email?: string;
    isverified?: boolean;
    name?: string;
    role?: "user" | "admin";
    profilePic?: string;
    password?: string;
  }
}