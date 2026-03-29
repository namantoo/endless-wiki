import { NextRequest, NextResponse } from "next/server";
import {
  getRandomArticles,
  getArticlesByCategory,
  getArticleByTitle,
} from "@/lib/wikipedia";
import { CATEGORIES } from "@/lib/config/categories";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function GET(req: NextRequest) {
  const count = Math.min(
    Number(req.nextUrl.searchParams.get("count") ?? "5"),
    10
  );
  const topic = req.nextUrl.searchParams.get("topic");       // category slug
  const exactTitle = req.nextUrl.searchParams.get("title");  // related deep dive

  try {
    let articles;

    if (exactTitle) {
      // Fetch one specific article by title (related topic deep dive)
      const article = await getArticleByTitle(decodeURIComponent(exactTitle));
      articles = article ? [article] : [];
    } else if (topic) {
      const cat = CATEGORIES.find((c) => c.slug === topic);
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
