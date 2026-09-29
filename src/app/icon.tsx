import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() { return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#123f3e", color: "#f4efe6", fontSize: 28, fontStyle: "italic", fontFamily: "serif" }}>YN</div>, size); }
