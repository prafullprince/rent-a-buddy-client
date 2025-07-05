"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import RegisterUser from "../Socket/RegisterUser";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List all routes where Navbar should be hidden
  const noNavbarRoutes = ["/chat", "/chat/[chatId]"];

  const hideNavbar = noNavbarRoutes.some(route =>
    pathname.startsWith(route.replace("[chatId]", ""))
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      <RegisterUser />
      <main>{children}</main>
    </>
  );
}
