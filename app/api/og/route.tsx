import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title   = searchParams.get("title")   ?? "Discover Something New";
  const desc    = searchParams.get("desc")    ?? "";
  const extract = searchParams.get("extract") ?? "";

  // First 2 sentences of the extract for the card body
  const dot = extract.indexOf(". ");
  const bodyText = dot > 20 ? extract.slice(0, dot + 1) : extract.slice(0, 220);

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
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: Wheels wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.94)", letterSpacing: "-0.5px" }}>
            Whee
          </span>
          <span style={{ fontSize: 24, fontWeight: 800, color: "#C6FF47", letterSpacing: "-0.5px" }}>
            ls
          </span>
        </div>

        {/* Middle: title + description + extract */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "rgba(255,255,255,0.94)",
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              maxWidth: "960px",
            }}
          >
            {title.length > 55 ? title.slice(0, 55) + "…" : title}
          </div>

          {desc && (
            <div
              style={{
                fontSize: 22,
                color: "#C6FF47",
                fontWeight: 600,
                maxWidth: "860px",
                lineHeight: 1.3,
              }}
            >
              {desc.length > 90 ? desc.slice(0, 90) + "…" : desc}
            </div>
          )}

          {bodyText && (
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.55)",
                maxWidth: "860px",
                lineHeight: 1.5,
                marginTop: "4px",
              }}
            >
              {bodyText.length > 200 ? bodyText.slice(0, 200) + "…" : bodyText}
            </div>
          )}
        </div>

        {/* Bottom: lime bar + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "3px", background: "#C6FF47", borderRadius: "2px" }} />
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.32)", fontWeight: 500 }}>
            Spin through the world's knowledge
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
