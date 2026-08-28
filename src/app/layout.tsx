import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/Common/LayoutWrapper";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],      // required
  display: 'swap',         // optional: better UX
  // weight: ['400', '700'],  // optional: choose weights you need
});

export const metadata: Metadata = {
  title: "RentaBuddy",
  description: "RentABuddy is a unique online platform where you can rent a friendly companion for life’s everyday moments. Whether you need someone to join you for a movie, dinner, travel, gaming, or just to chat, RentABuddy helps you connect with verified, like-minded individuals who are ready to make your day better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_28%,transparent_72%,rgba(20,184,166,0.06)_100%)]`}
      >
        <Providers>
          <ReduxProvider>
            <Toaster />
            <LayoutWrapper>{children}</LayoutWrapper>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
