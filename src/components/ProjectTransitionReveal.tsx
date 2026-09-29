"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { PROJECT_TRANSITION_COMPLETE } from "./ProjectVideoHero";

export function ProjectTransitionReveal() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("project-transitioning")) return;

    const sourceOverlay = document.querySelector<HTMLImageElement>("#project-transition-image");
    const destinationOverlay = document.querySelector<HTMLImageElement>("#project-transition-destination");
    const overlay = destinationOverlay ?? sourceOverlay;
    const backdrop = document.querySelector<HTMLElement>("#project-transition-backdrop");
    const hero = document.querySelector<HTMLElement>(".project-hero");
    const heroImage = hero?.querySelector<HTMLImageElement>("img");
    const crossfadeDestination = overlay?.dataset.crossfadeDestination === "true";
    const transitionVariant = overlay?.dataset.transitionVariant;
    const isVideoTransition = transitionVariant === "video";
    const isLandscapeTransition = transitionVariant === "landscape";
    const usesLandscapeFrame = isVideoTransition || isLandscapeTransition;
    const headline = gsap.utils.toArray<HTMLElement>(".project-intro > h1, .project-intro > em, .project-intro > .project-subtitle");
    const metadata = document.querySelector<HTMLElement>(".project-intro > dl");

    if (!overlay || !backdrop || !hero || !heroImage || !metadata) {
      root.classList.remove("project-transitioning");
      sourceOverlay?.remove();
      destinationOverlay?.remove();
      backdrop?.remove();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (sourceOverlay !== overlay) sourceOverlay?.remove();
    gsap.set("body > *:not(#project-transition-image):not(#project-transition-destination):not(#project-transition-backdrop):not(.skip-link)", { clearProps: "opacity" });
    const context = gsap.context(() => {
      gsap.set(headline, { opacity: 1, y: innerHeight * .22, clipPath: "inset(100% 0 0 0)" });
      gsap.set(metadata, { opacity: 0, y: innerHeight * .06 });
      // The shared image owns this handoff. A CSS opacity transition here
      // would leave the poster transparent after the overlay is removed.
      gsap.set(heroImage, { opacity: 0, transition: "none" });
    });
    let cancelled = false;

    const reveal = () => {
      if (cancelled) return;
      const heroRect = hero.getBoundingClientRect();

      context.add(() => {
        if (usesLandscapeFrame) {
          gsap.timeline({
            delay: .08,
            onComplete: () => {
              root.classList.remove("project-transitioning");
              // Return opacity to CSS so actual playback can fade the poster.
              gsap.set(heroImage, { clearProps: "opacity,transition" });
              gsap.set([...headline, metadata], { clearProps: "opacity,transform,clipPath" });
              sourceOverlay?.remove();
              destinationOverlay?.remove();
              backdrop.remove();
              window.dispatchEvent(new Event(PROJECT_TRANSITION_COMPLETE));
            },
          })
            .to(overlay, {
              left: heroRect.left,
              top: heroRect.top,
              width: heroRect.width,
              height: heroRect.height,
              duration: .72,
              ease: "power4.inOut",
            }, 0)
            .to(backdrop, { opacity: 0, duration: .34, ease: "power2.out" }, .04)
            .to(headline, {
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: .76,
              stagger: .045,
              ease: "power4.out",
            }, .38)
            .to(metadata, { opacity: 1, y: 0, duration: .46, ease: "power3.out" }, .68)
            .set(heroImage, { opacity: 1 }, .72)
            // Paint the decoded poster at full opacity underneath before
            // releasing the moving image, including its composited layer.
            .to(overlay, { opacity: 0, duration: .14, ease: "none" }, .74);
          return;
        }

        gsap.timeline({
          delay: .4,
          onComplete: () => {
            root.classList.remove("project-transitioning");
            gsap.set(heroImage, { clearProps: "opacity,transition" });
            gsap.set([...headline, metadata], { clearProps: "opacity,transform,clipPath" });
            sourceOverlay?.remove();
            destinationOverlay?.remove();
            backdrop.remove();
            window.dispatchEvent(new Event(PROJECT_TRANSITION_COMPLETE));
          },
        })
          .to(overlay, {
            left: heroRect.left,
            top: heroRect.top,
            width: heroRect.width,
            height: heroRect.height,
            duration: .74,
            ease: "power4.inOut",
          }, 0)
          .to(backdrop, { opacity: 0, duration: .36, ease: "power2.out" }, .08)
          .to(headline, {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: .74,
            stagger: .04,
            ease: "power4.out",
          }, .1)
          .to(metadata, { opacity: 1, y: 0, duration: .42, ease: "power3.out" }, .46)
          .to(heroImage, crossfadeDestination ? {
            opacity: 1,
            duration: .36,
            ease: "power2.inOut",
          } : { opacity: 0, duration: 0 }, crossfadeDestination ? .38 : 0)
          .to(overlay, crossfadeDestination ? {
            opacity: 0,
            duration: .36,
            ease: "power2.inOut",
          } : { opacity: 1, duration: 0 }, crossfadeDestination ? .38 : 0)
          .set(heroImage, { opacity: 1 }, .74)
          .set(overlay, { opacity: 0 }, .74);
      });
    };

    void heroImage.decode().catch(() => undefined).then(reveal);

    return () => {
      cancelled = true;
      context.revert();
    };
  }, []);

  return null;
}
