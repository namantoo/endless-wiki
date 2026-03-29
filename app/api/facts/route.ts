import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const ACTION_API = "https://en.wikipedia.org/w/api.php";
const WP_HEADERS = {
  "User-Agent": "EndlessWiki/1.0 (https://endless-wiki-scroll.vercel.app; namanmail4@gmail.com) next.js",
  "Api-User-Agent": "EndlessWiki/1.0",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const count = Math.min(Number(url.searchParams.get("count") ?? "30"), 50);

  // Step 1: get random article titles (fetch extras to cover filtered-out ones)
  const randomParams = new URLSearchParams({
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: String(Math.min(count + 10, 50)),
    format: "json",
    origin: "*",
  });

  const randomRes = await fetch(`${ACTION_API}?${randomParams}`, {
    headers: WP_HEADERS,
    cache: "no-store",
  });
  if (!randomRes.ok) return NextResponse.json([], { status: 502 });

  const randomData = await randomRes.json();
  const titles: string[] = (randomData?.query?.random ?? []).map(
    (p: { title: string }) => p.title
  );
  if (titles.length === 0) return NextResponse.json([], { status: 502 });

  // Step 2: batch-fetch intro extracts for all titles — single API call
  const extractParams = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "extracts",
    exintro: "true",       // intro section only
    exsentences: "2",      // first 2 sentences max
    explaintext: "true",   // plain text, no HTML
    format: "json",
    origin: "*",
  });

  const extractRes = await fetch(`${ACTION_API}?${extractParams}`, {
    headers: WP_HEADERS,
    cache: "no-store",
  });
  if (!extractRes.ok) return NextResponse.json([], { status: 502 });

  const extractData = await extractRes.json();
  const pages = Object.values(
    extractData?.query?.pages ?? {}
  ) as Array<{ title: string; extract?: string; missing?: string }>;

  const facts = pages
    .filter((p) => !("missing" in p) && p.extract && p.extract.trim().length > 40)
    .map((p) => {
      const text = p.extract!.trim().replace(/\n+/g, " ");
      // Take the first complete sentence (ends with ". ")
      const dot = text.indexOf(". ");
      const fact = dot > 20 ? text.slice(0, dot + 1) : text.slice(0, 160).trimEnd() + "…";
      return fact.length >= 25 ? fact : null;
    })
    .filter((f): f is string => f !== null)
    .slice(0, count);

  return NextResponse.json(facts, {
    headers: { "Cache-Control": "no-store" },
  });
}
