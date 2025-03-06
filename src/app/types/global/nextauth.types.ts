import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    serverToken?: string
    user: {
      id: string;
      serverToken: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
    serverToken: string;
  }
}
