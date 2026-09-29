import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { NextProjectLink } from "@/components/NextProjectLink";
import { ProjectBlocks } from "@/components/ProjectBlocks";
import { ProjectTransitionReveal } from "@/components/ProjectTransitionReveal";
import { ProjectVideoHero } from "@/components/ProjectVideoHero";
import { getNextProject, getProject, projects, projectArtworkClass } from "@/content/projects";
import { site } from "@/config/site";

export const generateStaticParams = () => projects.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug); if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/work/${project.slug}` }, openGraph: { title: project.title, description: project.summary, type: "article", images: [{ url: project.hero, alt: project.heroAlt }] }, twitter: { card: "summary_large_image", title: project.title, description: project.summary, images: [project.hero] } };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug); if (!project) notFound();
  const next = getNextProject(project.slug);
  const projectNumber = String(projects.findIndex(({ slug }) => slug === project.slug) + 1).padStart(2, "0");
  const video = project.blocks.find((block) => block.type === "youtube");
  const nextVideo = next.blocks.find((block) => block.type === "youtube");
  const contentBlocks = video ? project.blocks.filter((block) => block !== video) : project.blocks;
  const titleScale = project.title.length > 55 ? "xlong" : project.title.length > 36 ? "long" : project.title.length > 20 ? "medium" : "short";
  const schema = {
    "@context": "https://schema.org", "@type": "CreativeWork", name: project.title,
    description: project.summary, creator: { "@type": "Person", name: site.name },
    image: `${site.siteUrl}${project.hero}`, ...(project.externalUrl ? { url: project.externalUrl } : {}),
  };
  return <>
    <main className={`project-page project-${project.slug} category-${project.category.toLowerCase()}`} id="main-content">
      <ProjectTransitionReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className={`project-intro project-title-${titleScale}`}>
        <h1>{project.title}</h1>
        {project.year && <em>({project.year})</em>}
        {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
        <dl>
          <div><dt>Category</dt><dd>[{project.category.toUpperCase()}]</dd></div>
          <div><dt>Role</dt><dd>[{project.roles.join(" / ").toUpperCase()}]</dd></div>
          {project.client && <div><dt>Client</dt><dd>[{project.client.toUpperCase()}]</dd></div>}
          {!!project.tools?.length && <div><dt>Medium</dt><dd>[{project.tools.join(" / ").toUpperCase()}]</dd></div>}
        </dl>
      </header>
      {video ? (
        <ProjectVideoHero id={video.id} title={video.title} poster={video.poster} posterAlt={project.heroAlt} posterClassName={projectArtworkClass(project)} posterFit={video.posterFit} showYouTubeButton={video.showYouTubeButton} />
      ) : (
        <figure className="project-hero project-hero--contained" style={{ "--hero-ratio": project.heroAspectRatio ?? .8, "--frame-background": project.frameBackground ?? "#000" } as CSSProperties}><Image className={projectArtworkClass(project)} src={project.hero} alt={project.heroAlt} fill priority quality={95} sizes="(max-width: 720px) 100vw, 90vw" /></figure>
      )}
      <section className="project-statement"><span>{projectNumber}.</span><h2 className={project.statementLead ? "has-statement-lead" : undefined}>{project.statementKicker && <span className="project-statement-kicker">{project.statementKicker}</span>}{project.statementLead && <em className="project-statement-lead">{project.statementLead}</em>}<span className="project-statement-copy">{project.statement}</span></h2><b>[{project.shortLabel.toUpperCase()}]</b></section>
      <ProjectBlocks blocks={contentBlocks} />
      <NextProjectLink slug={next.slug} title={next.tileTitle ?? next.title} year={next.year} thumbnail={next.thumbnail} heroAlt={next.heroAlt} artworkClassName={projectArtworkClass(next)} transitionPoster={nextVideo?.poster ?? next.transitionArtwork} transitionPosterFit={nextVideo?.posterFit} transitionBackground={next.frameBackground} crossfadeTransitionPoster={!nextVideo && !!next.transitionArtwork} transitionVariant={nextVideo ? "video" : next.transitionStyle} />
    </main><Footer />
  </>;
}
