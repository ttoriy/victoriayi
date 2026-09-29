import { site } from "@/config/site";

export function Footer() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} {site.name}</span><span>{site.location}</span><a href="#top">Back to top ↑</a></footer>;
}
