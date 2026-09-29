import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/list", "/research", "/stories", "/film", "/about"]; return [...routes.map((route) => ({ url: `${site.siteUrl}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...projects.map((project) => ({ url: `${site.siteUrl}/work/${project.slug}`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: .8 }))]; }
