import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const ACTION_API = "https://en.wikipedia.org/w/api.php";
const WP_HEADERS = {
  "User-Agent": "EndlessWiki/1.0 (https://endless-wiki-scroll.vercel.app; namanmail4@gmail.com) next.js",
  "Api-User-Agent": "EndlessWiki/1.0",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const count = Math.min(Number(url.searchParams.get("count") ?? "30"), 50);

  try {
    // Step 1: pull from Featured_articles — curated, well-written, interesting
    // Random A-Z start ensures a different slice every call
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const catParams = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:Featured_articles",
      cmtype: "page",
      cmnamespace: "0",
      cmlimit: String(Math.min(count + 15, 50)),
      cmsort: "sortkey",
      cmstartsortkeyprefix: letter,
      format: "json",
      origin: "*",
    });

    const catRes = await fetch(`${ACTION_API}?${catParams}`, {
      headers: WP_HEADERS,
      cache: "no-store",
    });
    if (!catRes.ok) throw new Error("cat fetch failed");
    const catData = await catRes.json();
    let titles: string[] = (catData?.query?.categorymembers ?? []).map(
      (p: { title: string }) => p.title
    );

    // Fallback: if sparse letter, try a different one
    if (titles.length < 10) {
      const fallbackLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      const fbParams = new URLSearchParams({
        action: "query",
        list: "categorymembers",
        cmtitle: "Category:Featured_articles",
        cmtype: "page",
        cmnamespace: "0",
        cmlimit: String(Math.min(count + 15, 50)),
        cmsort: "sortkey",
        cmstartsortkeyprefix: fallbackLetter,
        format: "json",
        origin: "*",
      });
      const fbRes = await fetch(`${ACTION_API}?${fbParams}`, {
        headers: WP_HEADERS,
        cache: "no-store",
      });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        titles = (fbData?.query?.categorymembers ?? []).map(
          (p: { title: string }) => p.title
        );
      }
    }

    if (titles.length === 0) throw new Error("no titles");

    // Shuffle so order varies even within the same letter window
    titles = titles.sort(() => Math.random() - 0.5).slice(0, count + 5);

    // Step 2: batch-fetch intro extracts — single API call for all titles
    const extractParams = new URLSearchParams({
      action: "query",
      titles: titles.join("|"),
      prop: "extracts",
      exintro: "true",
      exsentences: "2",     // first 2 sentences — punchy fact length
      explaintext: "true",  // plain text, no HTML
      format: "json",
      origin: "*",
    });

    const extractRes = await fetch(`${ACTION_API}?${extractParams}`, {
      headers: WP_HEADERS,
      cache: "no-store",
    });
    if (!extractRes.ok) throw new Error("extract fetch failed");
    const extractData = await extractRes.json();

    const pages = Object.values(
      extractData?.query?.pages ?? {}
    ) as Array<{ title: string; extract?: string; missing?: string }>;

    const facts = pages
      .filter((p) => !("missing" in p) && p.extract && p.extract.trim().length > 50)
      .map((p) => {
        const text = p.extract!.trim().replace(/\n+/g, " ");
        // Take the first complete sentence
        const dot = text.indexOf(". ");
        const fact = dot > 25 ? text.slice(0, dot + 1) : text.slice(0, 180).trimEnd();
        return fact.length >= 30 ? fact : null;
      })
      .filter((f): f is string => f !== null)
      .slice(0, count);

    return NextResponse.json(facts, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[facts api]", err);
    return NextResponse.json([], { status: 500 });
  }
}
