"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav, site } from "@/config/site";
import { HeaderBrand } from "@/components/HeaderBrand";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || (href === "/" && pathname === "/list");
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        {/* A native link keeps Home reachable even if the client router is unavailable. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="descriptor" href="/" aria-label={`${site.name}, home`}>
          <HeaderBrand showName={pathname !== "/" && pathname !== "/list"} />
          {pathname !== "/" && pathname !== "/list" && <span className="header-home-label" aria-hidden="true">← Home</span>}
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNav.map((item) => <a key={item.href} className={isCurrent(item.href) ? "current" : ""} aria-current={isCurrent(item.href) ? "page" : undefined} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="message-link" href={`mailto:${site.email}`}>Send me a message</a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {primaryNav.map((item, index) => <a key={item.href} tabIndex={open ? 0 : -1} href={item.href} onClick={() => setOpen(false)}><span>{String(index + 1).padStart(2, "0")}.</span>{item.label.replace(",", "")}</a>)}
        </nav>
        <div className="mobile-menu-meta"><span>{site.location}</span><a tabIndex={open ? 0 : -1} href={`mailto:${site.email}`}>{site.email}</a></div>
      </div>
    </>
  );
}
