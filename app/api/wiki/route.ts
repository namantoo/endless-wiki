import { NextRequest, NextResponse } from "next/server";
import { getRandomArticles, getArticlesByCategory } from "@/lib/wikipedia";
import { CATEGORIES } from "@/lib/config/categories";

// Force dynamic — this endpoint returns random articles, must never be statically cached
export const dynamic = "force-dynamic";
// Give Wikipedia API calls enough time on Vercel
export const maxDuration = 20;

export async function GET(req: NextRequest) {
  const count = Math.min(
    Number(req.nextUrl.searchParams.get("count") ?? "5"),
    10
  );
  const topic = req.nextUrl.searchParams.get("topic"); // null = random

  try {
    let articles;
    if (topic) {
      // Look up the pool for this topic slug so the API uses deep subcategories
      const cat = CATEGORIES.find(c => c.slug === topic);
      const pool = cat?.pool ?? [topic];
      articles = await getArticlesByCategory(pool, count);
    } else {
      articles = await getRandomArticles(count);
    }

    return NextResponse.json(articles, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[wiki api]", err);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
