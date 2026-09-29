import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoryIndex } from "@/components/CategoryIndex";
export const metadata: Metadata = { title: "Prose", alternates: { canonical: "/stories" } };
export default function StoriesPage() { return <><CategoryIndex category="Prose" title="Stories for the hours when ordinary logic loosens its grip." /><Footer /></>; }
