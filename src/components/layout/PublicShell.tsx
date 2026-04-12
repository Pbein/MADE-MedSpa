"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { markNavigation } from "@/lib/navigation";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    markNavigation();
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
