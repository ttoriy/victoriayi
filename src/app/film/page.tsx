import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoryIndex } from "@/components/CategoryIndex";
export const metadata: Metadata = { title: "Video", alternates: { canonical: "/film" } };
export default function FilmPage() { return <><CategoryIndex category="Video" title="Films built from observation, rhythm, and a disciplined sense of wonder." /><Footer /></>; }
