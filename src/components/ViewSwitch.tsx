"use client";

import Link from "next/link";

type View = "carousel" | "list";

export function ViewSwitch({ active, busy = false, onViewChange }: { active: View; busy?: boolean; onViewChange?: (view: View) => void }) {
  const switchView = (event: React.MouseEvent<HTMLAnchorElement>, next: View) => {
    if (!onViewChange || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (!busy) onViewChange(next);
  };
  return <nav className="view-switch" aria-label="Project view"><Link className={active === "carousel" ? "active" : ""} aria-current={active === "carousel" ? "page" : undefined} aria-disabled={busy} href="/" onClick={(event) => switchView(event, "carousel")}>Carousel,</Link> <Link className={active === "list" ? "active" : ""} aria-current={active === "list" ? "page" : undefined} aria-disabled={busy} href="/list" onClick={(event) => switchView(event, "list")}>List</Link></nav>;
}
