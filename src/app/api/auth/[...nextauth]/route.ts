import { NextAuthOption } from "@/utills/nextauthoption.utills";
import NextAuth from "next-auth";


// handler
const handler = NextAuth(NextAuthOption);


// export handler
export { handler as GET, handler as POST };
