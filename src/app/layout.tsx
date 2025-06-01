import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/Common/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
