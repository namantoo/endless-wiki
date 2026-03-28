import { NextRequest, NextResponse } from "next/server";
import { getRandomArticles, getArticlesByCategory } from "@/lib/wikipedia";

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
    const articles = topic
      ? await getArticlesByCategory(topic, count)
      : await getRandomArticles(count);

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
