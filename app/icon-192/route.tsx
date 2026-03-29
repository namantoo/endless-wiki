// Generates the 192×192 PNG app icon on demand.
// Served at /icon-192.png — referenced in manifest.ts.
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
          borderRadius: "40px",  // safe zone for maskable icon
        }}
      >
        {/* "W" lettermark in lime — simple, recognisable at small sizes */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: "-4px",
            color: "white",
          }}
        >
          <span style={{ color: "white" }}>W</span>
          <span style={{ color: "#C6FF47", fontSize: 72 }}>s</span>
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
