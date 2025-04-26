import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const NextAuthOption: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt", // Ensure JWT session strategy is enabled
  },

  callbacks: {
    async signIn({ user }) {
      try {

        // Call your backend API
        const response = await fetch("https://rent-a-buddy-server-1.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        });

        if (!response.ok) {
          throw new Error("Error signing in");
        }

        const data = await response.json();

        // Attach token to the user object
        user.serverToken = data?.data?.token || null;
        user.accountType = data?.data?.role || "user";

        return true;
      } catch (error) {
        console.error("signIn error:", error);
        return false;
      }
    },

    // Store serverToken inside JWT
    async jwt({ token, user }) {

      if (user?.serverToken) {
        token.serverToken = user.serverToken;
      }

      if(user?.accountType){
        token.accountType = user.accountType;
      }

      return token;
    },

    // Pass token to session
    async session({ session, token }) {
      session.serverToken =
        typeof token.serverToken === "string" ? token.serverToken : undefined;
      session.accountType =
        typeof token.accountType === "string" ? token.accountType : undefined;
      console.log("Session Callback - Session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
