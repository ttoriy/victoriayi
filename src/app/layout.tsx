import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import "./overrides.css";
import "./content.css";
import { site } from "@/config/site";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: `${site.name} — Engineer, Researcher, Writer, Director`, template: `%s — ${site.name}` },
  description: "Selected engineering research, writing, films, and creative experiments.",
  openGraph: { title: `${site.name} — Engineer, Researcher, Writer, Director`, description: "Selected engineering research, writing, films, and creative experiments.", type: "website", images: [{ url: "/victoria-yi-homepage-preview.png", width: 1200, height: 630, alt: `${site.name} portfolio homepage with selected engineering, writing, and film projects` }] },
  twitter: { card: "summary_large_image", title: `${site.name} — Engineer, Researcher, Writer, Director`, description: "Selected engineering research, writing, films, and creative experiments.", images: ["/victoria-yi-homepage-preview.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top"><a className="skip-link" href="#main-content">Skip to content</a><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
