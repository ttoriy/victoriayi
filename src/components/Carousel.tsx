"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { projects, projectArtworkClass } from "@/content/projects";
import { beginProjectTransition } from "@/lib/projectTransition";

const mod = (value: number, length: number) => ((value % length) + length) % length;

export function Carousel({ enabled = true, onActiveChange, selectedIndex = 0 }: { enabled?: boolean; onActiveChange?: (index: number) => void; selectedIndex?: number }) {
  const router = useRouter();
  const track = useRef<HTMLDivElement>(null);
  const position = useRef(projects.length + selectedIndex);
  const target = useRef(projects.length + selectedIndex);
  const dragging = useRef(false);
  const pointerX = useRef(0);
  const pointerTravel = useRef(0);
  const transitioning = useRef(false);
  const [active, setActive] = useState(selectedIndex);
  const enabledRef = useRef(enabled);
  const items = useMemo(() => [...projects, ...projects, ...projects], []);

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { if (enabled) onActiveChange?.(active); }, [active, enabled, onActiveChange]);
  useEffect(() => {
    if (!enabled) {
      position.current = projects.length + selectedIndex;
      target.current = position.current;
    }
  }, [enabled, selectedIndex]);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let wheelSnap = 0;
    const render = () => {
      if (document.documentElement.classList.contains("index-view-transitioning")) {
        frame = requestAnimationFrame(render);
        return;
      }
      const length = projects.length;
      if (target.current < length * .55) { target.current += length; position.current += length; }
      if (target.current > length * 2.45) { target.current -= length; position.current -= length; }
      position.current += (target.current - position.current) * (reduce ? 1 : .105);
      if (track.current) {
        const cards = track.current.children;
        const compact = innerWidth < 720;
        const restingWidth = compact ? innerWidth * .66 : innerWidth / 7;
        const expansion = compact ? innerWidth * .1056 : restingWidth;

        // Ross Mason's carousel continuously hands the extra column width from
        // one project to the next. Tying width to the live scroll position keeps
        // the cards pushing each other instead of switching sizes at a midpoint.
        for (let index = 0; index < cards.length; index += 1) {
          const card = cards.item(index) as HTMLElement | null;
          if (!card) continue;
          const focus = Math.max(0, 1 - Math.abs(index - position.current));
          const width = restingWidth + expansion * focus;
          card.style.width = `${width}px`;
          card.style.flexBasis = `${width}px`;
        }

        const leftIndex = Math.floor(position.current);
        const rightIndex = Math.min(leftIndex + 1, cards.length - 1);
        const progress = position.current - leftIndex;
        const leftCard = cards.item(leftIndex) as HTMLElement | null;
        const rightCard = cards.item(rightIndex) as HTMLElement | null;
        if (leftCard && rightCard) {
          const leftCenter = leftCard.offsetLeft + leftCard.offsetWidth / 2;
          const rightCenter = rightCard.offsetLeft + rightCard.offsetWidth / 2;
          const scrollCenter = leftCenter + (rightCenter - leftCenter) * progress;
          track.current.style.transform = `translate3d(${innerWidth / 2 - scrollCenter}px,0,0)`;
        }
      }
      const nextActive = mod(Math.round(position.current), length);
      setActive((current) => current === nextActive ? current : nextActive);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    const onWheel = (event: WheelEvent) => {
      if (!enabledRef.current || document.documentElement.classList.contains("home-intro-active")) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      target.current += delta / (innerWidth < 720 ? 380 : 620);
      window.clearTimeout(wheelSnap);
      wheelSnap = window.setTimeout(() => { target.current = Math.round(target.current); }, 240);
    };
    const onKey = (event: KeyboardEvent) => {
      if (!enabledRef.current || document.documentElement.classList.contains("home-intro-active")) return;
      if (event.key === "ArrowRight") target.current = Math.round(target.current) + 1;
      if (event.key === "ArrowLeft") target.current = Math.round(target.current) - 1;
    };
    const root = track.current?.closest<HTMLElement>(".portfolio-page, .carousel-page");
    root?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    const intro = gsap.context(() => {
      const homeIntroIsRunning = document.documentElement.classList.contains("home-intro-active");
      if (enabledRef.current && !reduce && !homeIntroIsRunning) gsap.fromTo(".carousel-card", { y: 90, clipPath: "inset(0 0 100% 0)" }, { y: 0, clipPath: "inset(0 0 0% 0)", duration: .95, stagger: .045, ease: "power3.out", delay: .15, clearProps: "clipPath" });
    }, track);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(wheelSnap); root?.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKey); intro.revert(); };
  }, []);

  const onPointerDown = (event: React.PointerEvent) => { if (event.button !== 0) return; dragging.current = true; pointerX.current = event.clientX; pointerTravel.current = 0; };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = pointerX.current - event.clientX;
    pointerTravel.current += Math.abs(delta);
    pointerX.current = event.clientX;
    if (pointerTravel.current > 6 && !event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    target.current += delta / (innerWidth < 720 ? innerWidth * .66 : innerWidth / 7);
  };
  const onPointerUp = () => { dragging.current = false; target.current = Math.round(target.current); };
  const openProject = (event: React.MouseEvent<HTMLAnchorElement>, project: (typeof projects)[number]) => {
    if (pointerTravel.current > 6) { event.preventDefault(); pointerTravel.current = 0; return; }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (transitioning.current) return;
    const image = event.currentTarget.querySelector("img");
    if (!image) return router.push(`/work/${project.slug}`, { scroll: true });
    const video = project.blocks.find((block) => block.type === "youtube");
    transitioning.current = beginProjectTransition(image, () => {
      router.push(`/work/${project.slug}`, { scroll: false });
    }, video ? {
      destinationSrc: video.poster,
      destinationFit: video.posterFit,
      variant: "video",
    } : project.transitionArtwork ? {
      destinationSrc: project.transitionArtwork,
      crossfadeDestination: true,
      variant: project.transitionStyle,
    } : project.transitionStyle === "landscape" ? {
      destinationSrc: project.hero,
      destinationFit: "contain",
      destinationBackground: project.frameBackground,
      variant: project.transitionStyle,
    } : {
      destinationFit: "contain",
      crossfadeDestination: project.hero !== project.thumbnail,
    });
  };

  return (
    <div className="carousel-window" role="region" aria-label="Project carousel" tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="carousel-track" ref={track}>
        {items.map((project, index) => {
          const original = index >= projects.length && index < projects.length * 2;
          const isActive = mod(index, projects.length) === active;
          return <article className={`carousel-card ${isActive ? "is-active" : ""}`} key={`${project.slug}-${index}`} data-project-index={mod(index, projects.length)} aria-hidden={!original}>
            <a href={`/work/${project.slug}`} tabIndex={original ? 0 : -1} onClick={(event) => openProject(event, project)} onDragStart={(event) => event.preventDefault()} aria-label={`${project.title}, ${project.category}, ${project.year}`}>
              <div className="carousel-label"><span>{String(mod(index, projects.length) + 1).padStart(2, "0")}.</span><strong>{project.tileTitle ?? project.title}</strong><span>[{project.shortLabel}]</span></div>
              <div className="carousel-media"><Image className={projectArtworkClass(project)} src={project.thumbnail} alt={original ? project.heroAlt : ""} fill sizes="(max-width: 720px) 66vw, 29vw" priority={original && mod(index, projects.length) < 3} /></div>
            </a>
          </article>;
        })}
      </div>
    </div>
  );
}
