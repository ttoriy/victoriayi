import type { Metadata } from "next";
import { PortfolioIndex } from "@/components/PortfolioIndex";

export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <PortfolioIndex initialView="carousel" />;
}
