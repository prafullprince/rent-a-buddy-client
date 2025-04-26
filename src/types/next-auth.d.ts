/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      accountType?: string; // 👈 Add your custom field
    };
    accountType?: string;
  }

  interface User {
    accountType?: string;
  }

  interface JWT {
    accountType?: string;
  }
}
