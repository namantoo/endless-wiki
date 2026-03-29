// Generates the 512×512 PNG app icon on demand.
// Served at /icon-512.png — referenced in manifest.ts.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "108px",  // ~20% of size — maskable safe zone
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 260,
            letterSpacing: "-10px",
            color: "white",
          }}
        >
          <span style={{ color: "white" }}>W</span>
          <span style={{ color: "#C6FF47", fontSize: 196 }}>s</span>
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
