"use client";

import Image from "next/image";
import { useState } from "react";

export function YouTubeLite({ id, title, poster, posterFit }: { id: string; title: string; poster: string; posterFit?: "contain" }) {
  const [playing, setPlaying] = useState(false);
  return <div className="video-block">{playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}><Image className={posterFit ? `video-poster--${posterFit}` : undefined} src={poster} alt="" fill sizes="100vw" /><span>Play film <b>▶</b></span></button>}</div>;
}
