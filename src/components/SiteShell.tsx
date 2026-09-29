"use client";

import { createContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export const HomeIntroAllowed = createContext(false);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visit, setVisit] = useState({ pathname, initial: true });
  // The layout survives client navigation; a real refresh creates a new visit.
  // Update before rendering children so returning Home never mounts the intro.
  if (visit.pathname !== pathname) setVisit({ pathname, initial: false });
  const allowIntro = visit.initial && visit.pathname === pathname && pathname === "/";

  return <HomeIntroAllowed.Provider value={allowIntro}>
    <Header />
    {children}
  </HomeIntroAllowed.Provider>;
}
