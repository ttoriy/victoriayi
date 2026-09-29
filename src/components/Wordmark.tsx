import { site } from "@/config/site";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  const words = site.name.replace(/\[|\]/g, "").toLowerCase().split(/\s+/);
  const first = words.slice(0, -1).join(" ") || words[0];
  const last = words.length > 1 ? (words.at(-1) ?? "yi") : "yi";

  return (
    <div className={`giant-wordmark ${compact ? "compact" : ""}`} aria-label={site.name}>
      <span>{first}</span><em>{last}</em>
    </div>
  );
}
