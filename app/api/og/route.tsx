import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Discover Something New";
  const desc  = searchParams.get("desc")  ?? "Endless Wikipedia discovery";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0D",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: Wheels wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.94)", letterSpacing: "-1px" }}>
            Whee
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#C6FF47", letterSpacing: "-1px" }}>
            ls
          </span>
        </div>

        {/* Middle: article title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "rgba(255,255,255,0.94)",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              maxWidth: "900px",
              // clamp long titles
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            {title.length > 60 ? title.slice(0, 60) + "…" : title}
          </div>
          {desc && (
            <div
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.58)",
                maxWidth: "820px",
                lineHeight: 1.4,
              }}
            >
              {desc.length > 120 ? desc.slice(0, 120) + "…" : desc}
            </div>
          )}
        </div>

        {/* Bottom: lime accent bar + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              background: "#C6FF47",
              borderRadius: "2px",
            }}
          />
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
            Spin through the world's knowledge
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
