"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/config/site";

export function HeaderBrand({ showName }: { showName: boolean }) {
  const descriptor = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const previous = useRef(showName);
  const initialized = useRef(false);
  const words = site.name.toLowerCase().split(/\s+/);

  useLayoutEffect(() => {
    if (!descriptor.current || !name.current) return;
    if (!initialized.current) {
      initialized.current = true;
      // Pin the resting positions inline before CSS switches the route state.
      gsap.set(descriptor.current, { y: 0, yPercent: showName ? 115 : 0 });
      gsap.set(name.current, { y: 0, yPercent: showName ? 0 : 115 });
    }
    if (previous.current === showName) return;
    previous.current = showName;
    const incoming = showName ? name.current : descriptor.current;
    const outgoing = showName ? descriptor.current : name.current;
    gsap.killTweensOf([incoming, outgoing]);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(incoming, { yPercent: 0 });
      gsap.set(outgoing, { yPercent: -115 });
      return;
    }
    // Both directions travel upward, never reverse the old animation.
    gsap.set(incoming, { yPercent: 115 });
    gsap.to(outgoing, { yPercent: -115, duration: .65, ease: "power3.inOut" });
    gsap.to(incoming, { yPercent: 0, duration: .65, ease: "power3.inOut", delay: .06 });
    return () => { gsap.killTweensOf([incoming, outgoing]); };
  }, [showName]);

  return <span className="header-brand" data-name={showName} aria-hidden="true">
    <span className="header-brand-row header-brand-descriptor" ref={descriptor}>{site.shortDescriptor}</span>
    <span className="header-brand-row header-brand-signature" ref={name}>
      <span className="header-brand-name"><span>{words.slice(0, -1).join(" ")}</span><em>{words.at(-1)}</em></span>
    </span>
  </span>;
}
