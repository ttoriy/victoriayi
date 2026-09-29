"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const PROJECT_TRANSITION_COMPLETE = "project-transition:complete";

type ProjectVideoHeroProps = {
  id: string;
  title: string;
  poster: string;
  posterAlt: string;
  posterClassName?: string;
  posterFit?: "contain";
  showYouTubeButton?: boolean;
};

export function ProjectVideoHero({ id, title, poster, posterAlt, posterClassName, posterFit, showYouTubeButton = true }: ProjectVideoHeroProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const retryTimers = useRef<number[]>([]);
  const [canPlay, setCanPlay] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    const start = () => setCanPlay(true);
    window.addEventListener(PROJECT_TRANSITION_COMPLETE, start);

    // A direct visit has no shared-element transition to wait for.
    if (!document.documentElement.classList.contains("project-transitioning")) {
      const frameId = requestAnimationFrame(start);
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener(PROJECT_TRANSITION_COMPLETE, start);
      };
    }

    return () => {
      window.removeEventListener(PROJECT_TRANSITION_COMPLETE, start);
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      let payload: { event?: string; info?: number | { playerState?: number } } | undefined;
      try {
        payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (payload?.event === "onError") {
        setEmbedFailed(true);
        setReady(false);
      }
      // An iframe load (or elapsed time) does not mean a video frame exists.
      // Keep the poster until the player confirms playback, even on slow loads.
      if ((payload?.event === "onStateChange" && payload.info === 1) ||
          (payload?.event === "infoDelivery" && typeof payload.info === "object" && payload.info?.playerState === 1)) {
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const onPlayerLoad = () => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: `portfolio-video-${id}` }), "https://www.youtube.com");
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onError"] }), "https://www.youtube.com");
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "https://www.youtube.com");
    setPlayerLoaded(true);
  };

  useEffect(() => {
    if (!canPlay || !playerLoaded || embedFailed) return;

    const startPlayback = () => {
      const player = frame.current?.contentWindow;
      // Retry the subscription too: the iframe load can precede API readiness.
      player?.postMessage(JSON.stringify({ event: "listening", id: `portfolio-video-${id}` }), "https://www.youtube.com");
      player?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onError"] }), "https://www.youtube.com");
      player?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "https://www.youtube.com");
      player?.postMessage(JSON.stringify({ event: "command", func: "mute", args: [] }), "https://www.youtube.com");
      player?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "https://www.youtube.com");
    };

    startPlayback();
    retryTimers.current = [180, 560, 1100].map((delay) => window.setTimeout(startPlayback, delay));
    return () => {
      retryTimers.current.forEach((timer) => window.clearTimeout(timer));
      retryTimers.current = [];
    };
  }, [canPlay, playerLoaded, embedFailed, id]);

  const pageOrigin = typeof window === "undefined" ? "" : window.location.origin;
  const source = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&loop=1&playlist=${id}&enablejsapi=1&iv_load_policy=3${pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}&widget_referrer=${encodeURIComponent(pageOrigin)}` : ""}`;

  return (
    <figure className={`project-hero project-hero--video ${ready ? "is-video-ready" : ""}`}>
      {canPlay && !embedFailed && (
        <iframe
          ref={frame}
          className="project-video-frame"
          src={source}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          onLoad={onPlayerLoad}
        />
      )}
      <Image
        className={["project-video-poster", posterFit ? `project-video-poster--${posterFit}` : "", posterClassName].filter(Boolean).join(" ")}
        src={poster}
        alt={posterAlt}
        fill
        priority
        quality={95}
        sizes="100vw"
      />
      {showYouTubeButton && <a className="project-video-fallback" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">
        Watch on YouTube ↗
      </a>}
    </figure>
  );
}
