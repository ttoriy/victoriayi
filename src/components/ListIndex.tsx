"use client";

import Image from "next/image";
import Link from "next/link";
import { projects, projectArtworkClass } from "@/content/projects";

export function ListIndex({ active, onActiveChange }: { active: number; onActiveChange: (index: number) => void }) {
  return <div className="list-index">
    <div className="list-preview" aria-hidden="true">{projects.map((project, index) => <Image key={project.slug} className={`${index === active ? "is-active" : ""} ${projectArtworkClass(project)}`} src={project.thumbnail} alt="" fill sizes="29vw" loading="eager" />)}</div>
    <ol>{projects.map((project, index) => <li key={project.slug} className={index === active ? "active" : ""} onMouseEnter={() => onActiveChange(index)} onFocus={() => onActiveChange(index)}>
      <Link href={`/work/${project.slug}`}><span className="list-title">{project.tileTitle ?? project.title}{index < projects.length - 1 ? "," : ""}</span><Image className={projectArtworkClass(project)} src={project.thumbnail} alt={project.heroAlt} width={640} height={800} /></Link>
    </li>)}</ol>
  </div>;
}
