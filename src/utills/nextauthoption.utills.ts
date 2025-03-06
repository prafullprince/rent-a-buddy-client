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
        console.log("Signing in user:", user);

        // Call your backend API
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        });

        if (!response.ok) {
          throw new Error("Error signing in");
        }

        const data = await response.json();
        console.log("Received token from API:", data?.data);

        // Attach token to the user object
        user.serverToken = data?.data || null;

        return true;
      } catch (error) {
        console.error("signIn error:", error);
        return false;
      }
    },

    // Store serverToken inside JWT
    async jwt({ token, user }) {
      console.log("JWT Callback - Before:", token);

      if (user?.serverToken) {
        token.serverToken = user.serverToken;
      }

      console.log("JWT Callback - After:", token);
      return token;
    },

    // Pass token to session
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);

      session.serverToken =
        typeof token.serverToken === "string" ? token.serverToken : undefined;
      console.log("Session Callback - Session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
