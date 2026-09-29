import type { Metadata } from "next";
import { PortfolioIndex } from "@/components/PortfolioIndex";

export const metadata: Metadata = { title: "Project list", description: "All selected research, stories, films, and experiments.", alternates: { canonical: "/list" } };
export default function ListPage() { return <PortfolioIndex initialView="list" />; }
