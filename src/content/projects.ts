export type ProjectCategory = "Research" | "Prose" | "Video";

type TextBlock = { type: "text"; label?: string; heading?: string; body: string };
type ImageBlock = { type: "image"; src: string; alt: string; caption?: string; size?: "wide" | "narrow" };
type ImagePairBlock = { type: "imagePair"; images: { src: string; alt: string; caption?: string }[] };
type GalleryBlock = { type: "gallery"; images: { src: string; alt: string }[] };
type PosterBlock = { type: "poster"; src: string; alt: string; pdf?: string; caption?: string };
type YouTubeBlock = { type: "youtube"; id: string; title: string; poster: string; posterFit?: "contain"; showYouTubeButton?: boolean };
type QuoteBlock = { type: "quote"; quote: string; attribution?: string };
type CreditsBlock = { type: "credits"; items: { label: string; value: string }[] };
type DownloadBlock = { type: "download"; label: string; href: string; detail?: string };
type ExternalLinkBlock = { type: "externalLink"; label: string; href: string };

export type ProjectBlock =
  | TextBlock | ImageBlock | ImagePairBlock | GalleryBlock | PosterBlock
  | YouTubeBlock | QuoteBlock | CreditsBlock | DownloadBlock | ExternalLinkBlock
  | { type: "list"; label: string; items: string[] }
  | { type: "manuscript"; id: "the-metal-in-i" | "two-is-greater-than-one" | "hamartia" | "cinnamon-and-stars" };

export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  tileTitle?: string;
  artwork?: "contain" | "northwestern" | "stage";
  imagePosition?: "top";
  year: string;
  category: ProjectCategory;
  shortLabel: string;
  summary: string;
  statement: string;
  statementKicker?: string;
  statementLead?: string;
  thumbnail: string;
  hero: string;
  transitionArtwork?: string;
  transitionStyle?: "landscape";
  frameBackground?: string;
  heroAlt: string;
  heroAspectRatio?: number;
  roles: string[];
  client?: string;
  collaborators?: string[];
  tools?: string[];
  runtime?: string;
  featured: boolean;
  externalUrl?: string;
  blocks: ProjectBlock[];
};

export const projectArtworkClass = (project: Pick<Project, "artwork" | "imagePosition">) => [
  project.artwork ? `project-artwork--contain project-artwork--${project.artwork}` : "",
  project.imagePosition ? `project-image--${project.imagePosition}` : "",
].filter(Boolean).join(" ");

import { portfolioProjects } from "./portfolio-data";

// Keep unfinished projects in the source data so they can be restored without
// rebuilding their content, while excluding them from every public site view.
const hiddenProjectSlugs = new Set(["my-instax-and-i"]);

// Deliberately alternate media in the carousel while keeping the requested
// opening pair and hand-tuned project positions.
const carouselOrder = [
  "the-metal-in-i",
  "grain-boundary-segregation",
  "who-knows-me-better",
  "two-is-greater-than-one",
  "hamartia",
  "guess-the-major",
  "seap-celestial-navigation",
  "match-the-college-couple",
  "cinnamon-and-stars",
  "three-dancers-one-song",
  "gamma-ray-spectrometer",
];
export const projects: Project[] = portfolioProjects.filter(({ slug }) => !hiddenProjectSlugs.has(slug)).sort((a, b) => {
  const aIndex = carouselOrder.indexOf(a.slug);
  const bIndex = carouselOrder.indexOf(b.slug);
  if (aIndex === -1) return bIndex === -1 ? 0 : 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
export const getNextProject = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
};
