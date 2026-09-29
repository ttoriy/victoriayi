"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { beginProjectTransition } from "@/lib/projectTransition";

type NextProjectLinkProps = {
  slug: string;
  title: string;
  year: string;
  thumbnail: string;
  heroAlt: string;
  artworkClassName?: string;
  transitionPoster?: string;
  transitionPosterFit?: "contain";
  transitionBackground?: string;
  crossfadeTransitionPoster?: boolean;
  transitionVariant?: "video" | "landscape";
};

export function NextProjectLink({ slug, title, year, thumbnail, heroAlt, artworkClassName, transitionPoster, transitionPosterFit, transitionBackground, crossfadeTransitionPoster, transitionVariant }: NextProjectLinkProps) {
  const router = useRouter();
  const transitioning = useRef(false);
  const href = `/work/${slug}`;

  useEffect(() => { router.prefetch(href); }, [href, router]);

  const openProject = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (transitioning.current) return;

    const image = event.currentTarget.querySelector("img");
    if (!image) return router.push(href, { scroll: true });
    transitioning.current = beginProjectTransition(image, () => {
      router.push(href, { scroll: false });
    }, transitionPoster ? {
      destinationSrc: transitionPoster,
      destinationFit: transitionPosterFit,
      destinationBackground: transitionBackground,
      crossfadeDestination: crossfadeTransitionPoster,
      variant: transitionVariant,
    } : transitionVariant === "landscape" ? {
      destinationSrc: thumbnail,
      destinationFit: "contain",
      destinationBackground: transitionBackground,
      variant: transitionVariant,
    } : {
      destinationFit: "contain",
    });
  };

  return (
    <Link className={`next-project ${title.length > 25 ? "has-long-title" : ""}`} href={href} onClick={openProject} aria-label={`Next project: ${title}${year ? `, ${year}` : ""}`}>
      <span>[NEXT PROJECT]</span>
      <h2>{title}</h2>
      {year && <em>({year})</em>}
      <div><Image className={artworkClassName} src={thumbnail} alt={heroAlt} fill sizes="(max-width: 720px) 100vw, 48vw" /></div>
    </Link>
  );
}
