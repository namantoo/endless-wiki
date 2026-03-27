import { WikiArticle } from "@/types/wiki";

const WIKI_API = "https://en.wikipedia.org/api/rest_v1";
const WIKI_ACTION_API = "https://en.wikipedia.org/w/api.php";

export async function getRandomArticles(count: number = 5): Promise<WikiArticle[]> {
  const articles: WikiArticle[] = [];

  // Fetch random article titles via action API
  const params = new URLSearchParams({
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: String(count),
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${WIKI_ACTION_API}?${params}`);
  const data = await res.json();
  const randomPages: Array<{ id: number; title: string }> = data.query.random;

  // Fetch summaries in parallel
  const summaries = await Promise.allSettled(
    randomPages.map((page) =>
      fetch(`${WIKI_API}/page/summary/${encodeURIComponent(page.title)}`)
        .then((r) => r.json())
    )
  );

  for (let i = 0; i < summaries.length; i++) {
    const result = summaries[i];
    if (result.status === "fulfilled") {
      const s = result.value;
      if (s.type === "disambiguation" || !s.extract) continue;
      articles.push({
        id: s.pageid,
        title: s.title,
        extract: s.extract,
        thumbnail: s.thumbnail,
        pageUrl: s.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(s.title)}`,
      });
    }
  }

  return articles;
}
