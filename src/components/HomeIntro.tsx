"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type HomeIntroProps = {
  name: string;
  image: string;
  imageClassName?: string;
};

export function HomeIntro({ name, image, imageClassName }: HomeIntroProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const lastRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const words = name.replace(/\[|\]/g, "").toLowerCase().split(/\s+/);
  const first = words.slice(0, -1).join(" ") || words[0];
  const last = words.length > 1 ? (words.at(-1) ?? "yi") : "yi";

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const mark = markRef.current;
    const firstWord = firstRef.current;
    const lastWord = lastRef.current;
    const introImage = imageRef.current;
    if (!layer || !mark || !firstWord || !lastWord || !introImage) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      layer.style.display = "none";
      return;
    }

    const root = document.documentElement;
    root.classList.add("home-intro-active");
    let context: gsap.Context | undefined;
    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;

    const begin = async () => {
      const imageElement = introImage.querySelector("img");
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        imageElement?.decode().catch(() => undefined) ?? Promise.resolve(),
      ]);
      if (cancelled) return;

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (cancelled) return;
        const header = document.querySelector<HTMLElement>(".site-header");
        const wordmark = document.querySelector<HTMLElement>(".giant-wordmark");
        const targetFirst = wordmark?.querySelector<HTMLElement>(":scope > span");
        const targetLast = wordmark?.querySelector<HTMLElement>(":scope > em");
        const targetMedia = document.querySelector<HTMLElement>(".carousel-card[aria-hidden='false'].is-active .carousel-media")
          ?? document.querySelector<HTMLElement>(".carousel-card.is-active .carousel-media");
        const labels = gsap.utils.toArray<HTMLElement>(".carousel-label");
        const media = gsap.utils.toArray<HTMLElement>(".carousel-media");
        const otherMedia = media.filter((item) => item !== targetMedia);
        const supporting = gsap.utils.toArray<HTMLElement>(".view-switch, .location-clock, .carousel-help");
        const wash = layer.querySelector<HTMLElement>(".home-intro-wash");

        if (!header || !wordmark || !targetFirst || !targetLast || !targetMedia || !wash) {
          layer.style.display = "none";
          root.classList.remove("home-intro-active");
          return;
        }

        const firstTarget = targetFirst.getBoundingClientRect();
        const lastTarget = targetLast.getBoundingClientRect();
        const imageTarget = targetMedia.getBoundingClientRect();
        const center = (rect: DOMRect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        const firstDestination = center(firstTarget);
        const lastDestination = center(lastTarget);
        const imageDestination = center(imageTarget);
        const splitWidth = innerWidth <= 720 ? innerWidth * .38 : innerWidth * .135;
        const splitHeight = splitWidth * 1.25;
        const splitGap = innerWidth <= 720 ? 8 : Math.max(12, Math.min(innerWidth * .012, 24));

        context = gsap.context(() => {
          gsap.set(header, { opacity: 0 });
          gsap.set(supporting, { opacity: 0 });
          gsap.set(labels, { opacity: 0 });
          gsap.set(media, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(wordmark, { opacity: 0 });
          gsap.set(mark, { columnGap: splitGap });
          gsap.set(introImage, {
            width: splitWidth,
            height: splitHeight,
            clipPath: "inset(0 0 0 0)",
          });

          // Measure the exact split composition before resetting it. The
          // center grid guarantees the image remains centered while its width
          // pushes Victoria left and Yi right.
          const firstSplit = firstWord.getBoundingClientRect();
          const lastSplit = lastWord.getBoundingClientRect();
          const imageSplit = introImage.getBoundingClientRect();
          const firstSplitCenter = center(firstSplit);
          const lastSplitCenter = center(lastSplit);
          const imageSplitCenter = center(imageSplit);

          gsap.set(mark, { columnGap: 0 });
          gsap.set(introImage, {
            width: 0,
            height: 0,
            clipPath: "inset(0 50% 0 50%)",
          });
          // Reveal the whole glyph, including dots and descenders. The tight
          // line boxes are needed for the landing scale, not as clipping masks.
          gsap.set([firstWord, lastWord], { y: 22, opacity: 0 });

          gsap.timeline({
            onComplete: () => {
              gsap.set([header, ...supporting, ...labels, ...media, wordmark], {
                clearProps: "opacity,transform,clipPath",
              });
              layer.style.display = "none";
              root.classList.remove("home-intro-active");
            },
          })
            .to([firstWord, lastWord], {
              y: 0,
              opacity: 1,
              duration: .72,
              ease: "power4.out",
            }, .58)
            .to(mark, { columnGap: splitGap, duration: .65, ease: "power4.inOut" }, 1.65)
            .to(introImage, {
              width: splitWidth,
              height: splitHeight,
              clipPath: "inset(0 0% 0 0%)",
              duration: .65,
              ease: "power4.inOut",
            }, 1.65)
            .addLabel("expand", 3.05)
            .addLabel("landed", "expand+=1.12")
            .addLabel("nameHandoffComplete", "landed+=.2")
            .set(firstWord, {
              position: "absolute",
              left: firstSplit.left,
              top: firstSplit.top,
              width: firstSplit.width,
              height: firstSplit.height,
              margin: 0,
              x: 0,
              y: 0,
              transformOrigin: "50% 50%",
            }, "expand")
            .set(lastWord, {
              position: "absolute",
              left: lastSplit.left,
              top: lastSplit.top,
              width: lastSplit.width,
              height: lastSplit.height,
              margin: 0,
              x: 0,
              y: 0,
              transformOrigin: "50% 50%",
            }, "expand")
            .set(introImage, {
              position: "absolute",
              left: imageSplit.left,
              top: imageSplit.top,
              width: imageSplit.width,
              height: imageSplit.height,
              x: 0,
              y: 0,
              transformOrigin: "50% 50%",
            }, "expand")
            .set(mark, { display: "block", columnGap: 0 }, "expand")
            .to(wash, { opacity: 0, duration: .9, ease: "power2.out" }, "expand")
            .to(header, { opacity: 1, duration: .62, ease: "power2.out" }, "expand+=.3")
            .to(labels, {
              opacity: 1,
              duration: .68,
              stagger: .018,
              ease: "power2.out",
            }, "expand+=.08")
            .to(otherMedia, {
              clipPath: "inset(0 0 0% 0)",
              duration: .95,
              stagger: .018,
              ease: "power4.out",
            }, "expand+=.08")
            .to(supporting, { opacity: 1, duration: .5, ease: "power2.out" }, "expand+=.38")
            .to(firstWord, {
              x: firstDestination.x - firstSplitCenter.x,
              y: firstDestination.y - firstSplitCenter.y,
              scaleX: firstTarget.width / firstSplit.width,
              scaleY: firstTarget.height / firstSplit.height,
              transformOrigin: "50% 50%",
              duration: 1.12,
              ease: "power4.inOut",
            }, "expand")
            .to(lastWord, {
              x: lastDestination.x - lastSplitCenter.x,
              y: lastDestination.y - lastSplitCenter.y,
              scaleX: lastTarget.width / lastSplit.width,
              scaleY: lastTarget.height / lastSplit.height,
              transformOrigin: "50% 50%",
              duration: 1.12,
              ease: "power4.inOut",
            }, "expand")
            .to(introImage, {
              x: imageDestination.x - imageSplitCenter.x,
              y: imageDestination.y - imageSplitCenter.y,
              scaleX: imageTarget.width / imageSplit.width,
              scaleY: imageTarget.height / imageSplit.height,
              transformOrigin: "50% 50%",
              duration: 1.12,
              ease: "power4.inOut",
            }, "expand")
            .set(targetMedia, { clipPath: "inset(0 0 0 0)" }, "landed")
            // The moving words are now at rest and share the final wordmark's
            // exact proportions. Bring the final rendering in underneath the
            // opaque moving copy, then remove that copy. This avoids both the
            // one-frame size snap and a gray frame during the handoff.
            .to(wordmark, {
              opacity: 1,
              duration: .08,
              ease: "none",
            }, "landed")
            .to([firstWord, lastWord], {
              opacity: 0,
              duration: .12,
              ease: "none",
            }, "landed+=.08")
            // Keep the foreground image above the overlay words until they
            // are completely gone. The real carousel image lives below the
            // intro layer and cannot occlude those words during the handoff.
            .set(introImage, { opacity: 0 }, "nameHandoffComplete");
        }, layer);
        });
      });
    };

    begin();

    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      context?.revert();
      root.classList.remove("home-intro-active");
    };
  }, []);

  return (
    <div className="home-intro-layer" ref={layerRef} aria-hidden="true">
      <div className="home-intro-wash" />
      <div className="home-intro-mark" ref={markRef}>
        <span ref={firstRef}>{first}</span>
        <div className="home-intro-image" ref={imageRef}>
          <Image className={imageClassName} src={image} alt="" fill priority sizes="(max-width: 720px) 38vw, 14vw" />
        </div>
        <em ref={lastRef}>{last}</em>
      </div>
    </div>
  );
}
