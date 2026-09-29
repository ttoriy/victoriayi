"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { Carousel } from "@/components/Carousel";
import { HomeIntroAllowed } from "@/components/SiteShell";
import { HomeIntro } from "@/components/HomeIntro";
import { ListIndex } from "@/components/ListIndex";
import { LocalClock } from "@/components/LocalClock";
import { ViewSwitch } from "@/components/ViewSwitch";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/config/site";
import { projects, projectArtworkClass } from "@/content/projects";

type View = "carousel" | "list";

export function PortfolioIndex({ initialView }: { initialView: View }) {
  const allowIntro = useContext(HomeIntroAllowed);
  const [view, setView] = useState<View>(initialView);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const inFlight = useRef(false);
  const destination = useRef<View>(initialView);
  const generation = useRef(0);

  const cleanUp = useCallback(() => {
    generation.current += 1;
    timeline.current?.kill();
    timeline.current = null;
    overlay.current?.replaceChildren();
    document.documentElement.classList.remove("index-view-transitioning");
    const elements = [
      carousel.current, list.current,
      ...Array.from(carousel.current?.querySelectorAll(".carousel-media, .carousel-label, .carousel-card") ?? []),
      ...Array.from(list.current?.querySelectorAll(".list-preview, .list-title") ?? []),
    ].filter(Boolean);
    gsap.set(elements, { clearProps: "visibility,opacity,transform" });
    inFlight.current = false;
  }, []);

  const finish = useCallback((next: View, updateHistory = true) => {
    // Keep the same header, name and footer nodes throughout. A client-side
    // history update makes this a view change, not a page remount and flash.
    flushSync(() => { setView(next); setBusy(false); });
    cleanUp();
    if (updateHistory && window.location.pathname !== (next === "list" ? "/list" : "/")) {
      window.history.pushState(null, "", next === "list" ? "/list" : "/");
    }
  }, [cleanUp]);

  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname === "/" || window.location.pathname === "/list") {
        finish(window.location.pathname === "/list" ? "list" : "carousel", false);
      }
    };
    const onResize = () => { if (inFlight.current) finish(destination.current); };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("resize", onResize);
      cleanUp();
    };
  }, [cleanUp, finish]);

  const changeView = async (next: View) => {
    if (next === view || inFlight.current) return;
    destination.current = next;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth <= 720) {
      finish(next);
      return;
    }
    if (!carousel.current || !list.current || !overlay.current) return;
    inFlight.current = true;
    setBusy(true);
    const currentGeneration = ++generation.current;
    document.documentElement.classList.add("index-view-transitioning");

    if (next === "carousel") {
      // The carousel stays mounted at its last selection; never replay the
      // homepage intro when returning from List.
      gsap.set(carousel.current, { visibility: "visible", opacity: 0 });
      timeline.current = gsap.timeline({ onComplete: () => finish("carousel") })
        .to(list.current, { opacity: 0, duration: .28, ease: "power2.inOut" }, 0)
        .to(carousel.current, { opacity: 1, duration: .5, ease: "power2.out" }, .16);
      return;
    }

    const preview = list.current.querySelector<HTMLElement>(".list-preview");
    if (!preview) { finish("list"); return; }
    const targetRect = preview.getBoundingClientRect();
    const cards = Array.from(carousel.current.querySelectorAll<HTMLElement>(".carousel-card"));
    const selectedCards = projects.map((_, index) => cards
      .filter((card) => Number(card.dataset.projectIndex) === index)
      .sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return Math.abs(ra.left + ra.width / 2 - innerWidth / 2) - Math.abs(rb.left + rb.width / 2 - innerWidth / 2);
      })[0]);
    const stackWidth = innerWidth * .24;
    const stackLeft = (innerWidth - stackWidth) / 2;
    const stackTop = innerHeight * .27;
    const moving = selectedCards.flatMap((card, index) => {
      const media = card?.querySelector<HTMLElement>(".carousel-media");
      const image = media?.querySelector("img");
      if (!media || !image) return [];
      const rect = media.getBoundingClientRect();
      const tile = document.createElement("div");
      tile.className = "index-transition-card";
      tile.dataset.projectIndex = String(index);
      Object.assign(tile.style, {
        left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
        zIndex: String(index === active ? projects.length + 1 : index + 1),
      });
      const clone = image.cloneNode() as HTMLImageElement;
      clone.removeAttribute("srcset");
      clone.removeAttribute("sizes");
      clone.removeAttribute("loading");
      clone.removeAttribute("style");
      clone.src = image.currentSrc || image.src;
      clone.alt = "";
      tile.append(clone);
      return [{ tile, clone, rect, index }];
    });

    const previewImage = preview.querySelectorAll("img")[active];
    await Promise.all([...moving.map(({ clone }) => clone.decode().catch(() => undefined)), previewImage?.decode().catch(() => undefined)]);
    if (generation.current !== currentGeneration) return;

    overlay.current?.append(...moving.map(({ tile }) => tile));
    gsap.set(carousel.current.querySelectorAll(".carousel-media"), { visibility: "hidden" });
    gsap.set(list.current, { visibility: "visible" });
    gsap.set(preview, { visibility: "hidden" });
    const titles = Array.from(list.current.querySelectorAll<HTMLElement>(".list-title"));
    const lineTops = [...new Set(titles.map((title) => Math.round(title.getBoundingClientRect().top)))].sort((a, b) => a - b);
    const titleLines = titles.map((title) => lineTops.indexOf(Math.round(title.getBoundingClientRect().top)));
    gsap.set(titles, { yPercent: 115, opacity: 0 });

    const animation = gsap.timeline({ onComplete: () => finish("list") });
    timeline.current = animation;
    animation.to(carousel.current.querySelectorAll(".carousel-label"), { opacity: 0, duration: .32, ease: "power2.out" }, 0);
    moving.forEach(({ tile, rect, index }) => {
      // First collect into one centered deck. Then stagger the same objects
      // along a diagonal into the list preview, with the selected image on top.
      animation.to(tile, {
        x: stackLeft - rect.left, y: stackTop - rect.top, scale: stackWidth / rect.width,
        duration: .9, ease: "power3.inOut", force3D: true,
      }, index * .018);
      animation.to(tile, {
        x: targetRect.left - rect.left, y: targetRect.top - rect.top, scale: targetRect.width / rect.width,
        duration: .95, ease: "power3.inOut", force3D: true,
      }, 1.3 + index * .06);
    });
    titles.forEach((title, index) => animation.to(title, {
      yPercent: 0, opacity: 1, duration: .75, ease: "power3.out",
    }, 1.6 + titleLines[index] * .11));
    animation.set(preview, { visibility: "visible" });
  };

  return (
    <main className={`portfolio-page ${view === "list" ? "list-page" : "carousel-page"}`} data-view={view} id="main-content" aria-busy={busy}>
      <div className="portfolio-carousel-surface" ref={carousel} inert={view !== "carousel" || busy} aria-hidden={view !== "carousel"}>
        <Carousel enabled={view === "carousel" && !busy} onActiveChange={setActive} selectedIndex={active} />
      </div>
      <div className="portfolio-list-surface" ref={list} inert={view !== "list" || busy} aria-hidden={view !== "list"}>
        <ListIndex active={active} onActiveChange={setActive} />
      </div>
      <Wordmark />
      <ViewSwitch active={view} busy={busy} onViewChange={changeView} />
      <div className="location-clock">{site.location} <LocalClock /></div>
      <div className="index-transition-layer" ref={overlay} aria-hidden="true" />
      {initialView === "carousel" && allowIntro && <HomeIntro name={site.name} image={projects[0].thumbnail} imageClassName={projectArtworkClass(projects[0])} />}
    </main>
  );
}
