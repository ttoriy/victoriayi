import Image from "next/image";
import type { ProjectBlock } from "@/content/projects";
import { PosterViewer } from "./PosterViewer";
import { YouTubeLite } from "./YouTubeLite";
import { Manuscript } from "./Manuscript";

export function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  return <div className="project-blocks">{blocks.map((block, index) => {
    switch (block.type) {
      case "manuscript": return <Manuscript key={index} id={block.id} />;
      case "list": return <section className="text-block research-points" key={index}><span>[{block.label}]</span><ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
      case "text": return <section className="text-block" key={index}><span>[{block.label || "PROJECT INFO"}]</span><div>{block.heading && <h2>{block.heading}</h2>}<p>{block.body}</p></div></section>;
      case "image": return <figure className={`image-block ${block.size || "wide"}`} key={index}><Image src={block.src} alt={block.alt} width={1600} height={2000} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
      case "imagePair": return <div className="image-pair" key={index}>{block.images.map((image) => <figure key={image.src}><Image src={image.src} alt={image.alt} width={1600} height={2000} />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>;
      case "gallery": return <div className="gallery-block" key={index}>{block.images.map((image, imageIndex) => <figure key={`${image.src}-${imageIndex}`}><Image src={image.src} alt={image.alt} width={1600} height={2000} /></figure>)}</div>;
      case "poster": return <PosterViewer key={index} {...block} />;
      case "youtube": return <YouTubeLite key={index} {...block} />;
      case "quote": return <blockquote key={index}>“{block.quote}”{block.attribution && <cite>— {block.attribution}</cite>}</blockquote>;
      case "credits": return <section className="credits-block" key={index}><span>[CREDITS]</span><dl>{block.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>;
      case "download": return <a className="action-block" href={block.href} download key={index}><span>{block.label}</span><small>{block.detail}</small><b>Download ↘</b></a>;
      case "externalLink": return <a className="action-block" href={block.href} target="_blank" rel="noreferrer" key={index}><span>{block.label}</span><b>Open ↗</b></a>;
    }
  })}</div>;
}
