"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function PosterViewer({ src, alt, pdf, caption }: { src: string; alt: string; pdf?: string; caption?: string }) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return <figure className="poster-block"><button type="button" onClick={() => setOpen(true)} aria-label={`View ${alt} full screen`}><Image src={src} alt={alt} width={1600} height={2000} /></button><figcaption>{caption}{pdf && <a href={pdf} download>Download accessible PDF ↘</a>}</figcaption>{open && <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt}><button ref={closeButton} type="button" onClick={() => setOpen(false)}>Close</button><Image src={src} alt={alt} width={1600} height={2000} priority />{pdf && <a href={pdf} download>Download PDF ↘</a>}</div>}</figure>;
}
