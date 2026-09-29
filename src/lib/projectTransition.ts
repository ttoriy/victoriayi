import gsap from "gsap";

type ProjectTransitionOptions = {
  destinationSrc?: string;
  destinationFit?: "contain";
  destinationBackground?: string;
  crossfadeDestination?: boolean;
  variant?: "video" | "landscape";
};

export function beginProjectTransition(image: HTMLImageElement, navigate: () => void, options: ProjectTransitionOptions = {}) {
  if (document.querySelector("#project-transition-image")) return false;

  const rect = image.getBoundingClientRect();
  const backdrop = document.createElement("div");
  const clone = image.cloneNode() as HTMLImageElement;
  const destination = options.destinationSrc ? document.createElement("img") : null;
  const imageStyle = getComputedStyle(image);
  backdrop.id = "project-transition-backdrop";
  Object.assign(backdrop.style, {
    position: "fixed",
    zIndex: "99",
    inset: "0",
    background: getComputedStyle(document.body).backgroundColor,
    opacity: "0",
    pointerEvents: "none",
  });
  clone.removeAttribute("srcset");
  clone.removeAttribute("sizes");
  clone.removeAttribute("loading");
  clone.src = image.currentSrc || image.src;
  clone.decoding = "sync";
  clone.fetchPriority = "high";
  clone.id = "project-transition-image";
  clone.alt = "";
  clone.dataset.crossfadeDestination = options.crossfadeDestination ? "true" : "false";
  clone.dataset.transitionVariant = options.variant ?? "default";
  Object.assign(clone.style, {
    position: "fixed",
    zIndex: "100",
    objectFit: destination ? (imageStyle.objectFit || "cover") : ((options.destinationFit ?? imageStyle.objectFit) || "cover"),
    objectPosition: imageStyle.objectPosition || "50% 50%",
    background: !destination && options.destinationFit === "contain" ? "#000" : "transparent",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    borderRadius: "0",
    pointerEvents: "none",
    willChange: "left, top, width, height, opacity",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  });

  if (destination) {
    destination.src = options.destinationSrc!;
    destination.id = "project-transition-destination";
    destination.alt = "";
    destination.dataset.crossfadeDestination = options.crossfadeDestination ? "true" : "false";
    destination.dataset.transitionVariant = options.variant ?? "default";
    destination.decoding = "sync";
    destination.fetchPriority = "high";
    Object.assign(destination.style, {
      position: "fixed",
      zIndex: "101",
      objectFit: options.destinationFit ?? "cover",
      objectPosition: "50% 50%",
      background: options.destinationBackground ?? (options.destinationFit === "contain" ? "#000" : "transparent"),
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      borderRadius: "0",
      opacity: "0",
      pointerEvents: "none",
      willChange: "left, top, width, height, opacity",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    });
  }

  document.body.append(backdrop, clone);
  if (destination) document.body.append(destination);

  const compact = innerWidth < 720;
  const restingWidth = compact ? innerWidth * .66 : innerWidth / 7;
  const restingHeight = restingWidth * 1.25;
  const restingLeft = (innerWidth - restingWidth) / 2;
  const header = document.querySelector<HTMLElement>(".site-header");
  const inset = header ? parseFloat(getComputedStyle(header).paddingLeft) : innerWidth * .033;
  document.documentElement.classList.add("project-transitioning");

  const movingImages = destination ? [clone, destination] : [clone];
  const runTransition = () => {
    const timeline = gsap.timeline({
      onComplete: () => {
        navigate();
        window.setTimeout(() => {
          clone.remove();
          destination?.remove();
          backdrop.remove();
          document.documentElement.classList.remove("project-transitioning");
        }, 5000);
      },
    });

    if (options.variant === "video" || options.variant === "landscape") {
      const expandedWidth = innerWidth - inset * 2;
      const expandedHeight = expandedWidth * 9 / 16;
      const liftedTop = Math.max(innerHeight * .1, rect.top - Math.min(22, innerHeight * .025));

      timeline
        .to(backdrop, { opacity: 1, duration: .28, ease: "power2.inOut" }, 0)
        .to(movingImages, {
          top: liftedTop,
          duration: .18,
          ease: "power2.out",
        }, 0)
        .to(movingImages, {
          left: inset,
          top: innerHeight * .12,
          width: expandedWidth,
          height: expandedHeight,
          duration: .62,
          ease: "power4.inOut",
        }, .16);

      if (destination) {
        gsap.set(destination, {
          objectFit: options.variant === "landscape" ? (options.destinationFit ?? "cover") : "cover",
          background: options.variant === "landscape" && options.destinationFit === "contain" ? (options.destinationBackground ?? "#000") : "transparent",
        });
        timeline
          .to(clone, { opacity: 0, duration: .34, ease: "power2.inOut" }, .12)
          .to(destination, { opacity: 1, duration: .34, ease: "power2.inOut" }, .12);
      }
      return;
    }

    timeline
      .to(backdrop, { opacity: .86, duration: .3, ease: "power2.out" }, 0)
      .to(movingImages, {
        left: restingLeft,
        top: Math.max(innerHeight * .12, Math.min(rect.top, innerHeight * .48)),
        width: restingWidth,
        height: restingHeight,
        duration: .32,
        ease: "power2.inOut",
      }, 0)
      .to(backdrop, { opacity: 1, duration: .18, ease: "power2.in" }, .18)
      .to(movingImages, {
        left: inset,
        top: innerHeight * .12,
        width: innerWidth - inset * 2,
        height: innerHeight * .88,
        duration: .58,
        ease: "power4.inOut",
      }, .3);

    if (destination) {
      timeline
        .to(clone, { opacity: 0, duration: .36, ease: "power2.inOut" }, .14)
        .to(destination, { opacity: 1, duration: .36, ease: "power2.inOut" }, .14);
    }
  };

  if (destination) {
    void destination.decode().catch(() => undefined).then(runTransition);
  } else {
    runTransition();
  }

  return true;
}
