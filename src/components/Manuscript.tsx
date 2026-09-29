import manuscripts from "@/content/manuscripts.json";
import poetry from "@/content/poetry-pages.json";

type Passage = { kind: string; text: string; runs?: { text: string; italic: boolean; bold: boolean }[] };

const poetryPageGroups = [[0, 1], [2, 3], [4], [5, 6], [7]];
const mobilePoetryText = (text: string) => text
  .split("\n")
  .map((line) => line.trim().replace(/\s{2,}/g, " "))
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

/** Server-rendered: full manuscripts never enter the carousel's client bundle. */
export function Manuscript({ id }: { id: keyof typeof manuscripts | "the-metal-in-i" }) {
  if (id === "the-metal-in-i") return (
    <section className="poetry-manuscript" aria-label="the metal in i — complete poetry collection">
      {poetryPageGroups.map((pages, poemIndex) => {
        const text = pages.map((pageIndex) => poetry[pageIndex].text.trimEnd()).join("\n");
        return <article className="poetry-poem" key={poemIndex}>
          <pre className="poetry-copy poetry-copy--spatial">{text}</pre>
          <pre className="poetry-copy poetry-copy--mobile">{mobilePoetryText(text)}</pre>
        </article>;
      })}
    </section>
  );
  const passages: Passage[] = manuscripts[id];
  return <article className="manuscript" aria-label="Complete text">
    {passages.map((passage, i) => {
      if (passage.kind === "heading") return <h2 key={i}>{passage.text}</h2>;
      if (passage.kind === "divider") return <hr key={i} />;
      if (passage.kind === "verse") return <pre className="manuscript-verse" key={i}>{passage.text}</pre>;
      return <p key={i}>{passage.runs ? passage.runs.map((run, j) => {
        const text = run.italic ? <em>{run.text}</em> : run.text;
        return run.bold ? <strong key={j}>{text}</strong> : <span key={j}>{text}</span>;
      }) : passage.text}</p>;
    })}
  </article>;
}
