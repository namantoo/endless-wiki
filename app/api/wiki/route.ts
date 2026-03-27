import { NextRequest, NextResponse } from "next/server";
import { getRandomArticles } from "@/lib/wikipedia";

export async function GET(req: NextRequest) {
  const count = Number(req.nextUrl.searchParams.get("count") ?? "5");
  try {
    const articles = await getRandomArticles(Math.min(count, 10));
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
