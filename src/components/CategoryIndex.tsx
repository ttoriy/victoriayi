import Image from "next/image";
import Link from "next/link";
import { projects, projectArtworkClass, type ProjectCategory } from "@/content/projects";

export function CategoryIndex({ category, title }: { category: ProjectCategory; title: string }) {
  const selected = projects.filter((project) => project.category === category);
  return <main className="category-page" id="main-content"><header className="category-hero"><span>[SELECTED {category.toUpperCase()}]</span><h1>{title}</h1></header><div className="category-grid">{selected.map((project, index) => <Link href={`/work/${project.slug}`} key={project.slug} className={index % 3 === 1 ? "offset" : ""}><div><Image className={projectArtworkClass(project)} src={project.thumbnail} alt={project.heroAlt} fill sizes="(max-width: 720px) 100vw, 45vw" /></div><p><span>{String(index + 1).padStart(2, "0")}.</span>{project.tileTitle ?? project.title}{project.year && <em>({project.year})</em>}</p></Link>)}</div></main>;
}
