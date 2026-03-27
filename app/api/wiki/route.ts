import { NextRequest, NextResponse } from "next/server";
import { getRandomArticles, getArticlesByCategory } from "@/lib/wikipedia";

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

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
