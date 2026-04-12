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
    <div
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        backgroundColor: "#fbfaef",
      }}
    >
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
