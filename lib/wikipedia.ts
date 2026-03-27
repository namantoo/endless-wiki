import { WikiArticle, RelatedTopic } from "@/types/wiki";
import { colorSeedFromTitle } from "@/lib/config/gradients";

const REST_API    = "https://en.wikipedia.org/api/rest_v1";
const ACTION_API  = "https://en.wikipedia.org/w/api.php";

// Categories to strip — maintenance/administrative, not meaningful to users
const MAINTENANCE_PATTERN =
  /^(Articles|Pages|CS1|Use |Coordinates|All |Wikipedia|Webarchive|Short |Good |Featured |Spoken )/i;

// ─── Extract trimming ─────────────────────────────────────────────

function trimExtract(
  text: string,
  targetWords = 200
): { preview: string; full: string } {
  const full = text.trim();
  const words = full.split(/\s+/);
  if (words.length <= targetWords) return { preview: full, full };

  // Find a sentence boundary near the target word count
  const rough = words.slice(0, targetWords + 20).join(" ");
  const cutoff = targetWords * 6; // ~6 chars per word average
  const sentenceEnd = rough.lastIndexOf(". ", cutoff);
  const preview =
    sentenceEnd > 0
      ? rough.slice(0, sentenceEnd + 1)
      : words.slice(0, targetWords).join(" ") + "…";

  return { preview, full };
}

// ─── Single article enrichment ────────────────────────────────────

interface RawSummary {
  pageid: number;
  title: string;
  displaytitle: string;
  description?: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls?: { desktop?: { page?: string } };
  type?: string;
}

async function fetchSummary(title: string): Promise<RawSummary | null> {
  try {
    const res = await fetch(
      `${REST_API}/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface RawCatLink {
  categories?: Array<{ title: string }>;
  links?: Array<{ ns: number; title: string }>;
}

async function fetchCategoriesAndLinks(
  title: string
): Promise<{ categories: string[]; links: string[] }> {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: title,
      prop: "categories|links",
      cllimit: "20",
      plnamespace: "0",
      pllimit: "10",
      format: "json",
      origin: "*",
    });
    const res = await fetch(`${ACTION_API}?${params}`);
    if (!res.ok) return { categories: [], links: [] };
    const data = await res.json();

    const pages: Record<string, RawCatLink> = data?.query?.pages ?? {};
    const page = Object.values(pages)[0];

    const categories = (page?.categories ?? [])
      .map((c) => c.title.replace(/^Category:/, ""))
      .filter((c) => !MAINTENANCE_PATTERN.test(c))
      .slice(0, 3);

    const links = (page?.links ?? [])
      .filter((l) => l.ns === 0)
      .map((l) => l.title)
      .slice(0, 6); // fetch a few extra in case some fail

    return { categories, links };
  } catch {
    return { categories: [], links: [] };
  }
}

async function buildRelatedTopics(
  linkTitles: string[]
): Promise<RelatedTopic[]> {
  if (linkTitles.length === 0) return [];

  const results = await Promise.allSettled(
    linkTitles.slice(0, 4).map((t) => fetchSummary(t))
  );

  const topics: RelatedTopic[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value && r.value.type !== "disambiguation") {
      topics.push({
        title: r.value.title,
        pageUrl:
          r.value.content_urls?.desktop?.page ??
          `https://en.wikipedia.org/wiki/${encodeURIComponent(r.value.title)}`,
      });
    }
  }
  return topics.slice(0, 4);
}

async function enrichArticle(title: string): Promise<WikiArticle | null> {
  const [summary, { categories, links }] = await Promise.all([
    fetchSummary(title),
    fetchCategoriesAndLinks(title),
  ]);

  if (!summary || !summary.extract || summary.type === "disambiguation") {
    return null;
  }

  const { preview, full } = trimExtract(summary.extract);
  const relatedTopics = await buildRelatedTopics(links);

  return {
    id: summary.pageid,
    title: summary.title,
    displayTitle: summary.displaytitle ?? summary.title,
    extract: preview,
    extractFull: full,
    description: summary.description,
    thumbnail: summary.thumbnail,
    pageUrl:
      summary.content_urls?.desktop?.page ??
      `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title)}`,
    categories,
    relatedTopics,
    colorSeed: colorSeedFromTitle(summary.title),
    lang: "en",
  };
}

// ─── Public API ───────────────────────────────────────────────────

/** Fetch N random articles from Wikipedia. */
export async function getRandomArticles(
  count: number = 5
): Promise<WikiArticle[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: String(count),
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${ACTION_API}?${params}`);
  const data = await res.json();
  const titles: string[] = (data?.query?.random ?? []).map(
    (p: { title: string }) => p.title
  );

  const results = await Promise.allSettled(titles.map(enrichArticle));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WikiArticle> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

/** Fetch N articles from a specific Wikipedia category. */
export async function getArticlesByCategory(
  categorySlug: string,
  count: number = 5
): Promise<WikiArticle[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "categorymembers",
    cmtitle: `Category:${categorySlug}`,
    cmnamespace: "0",
    cmlimit: String(count + 3), // fetch a few extra to account for failures
    cmsort: "timestamp",
    cmdir: "desc",
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${ACTION_API}?${params}`);
  const data = await res.json();
  const titles: string[] = (data?.query?.categorymembers ?? []).map(
    (p: { title: string }) => p.title
  );

  const results = await Promise.allSettled(titles.map(enrichArticle));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WikiArticle> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
    .slice(0, count);
}
