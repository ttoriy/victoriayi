import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoryIndex } from "@/components/CategoryIndex";
export const metadata: Metadata = { title: "Research", alternates: { canonical: "/research" } };
export default function ResearchPage() { return <><CategoryIndex category="Research" title="Research as a way of noticing what systems leave at the edge." /><Footer /></>; }
