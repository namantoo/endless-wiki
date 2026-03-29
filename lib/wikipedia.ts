import { WikiArticle, RelatedTopic } from "@/types/wiki";
import { colorSeedFromTitle } from "@/lib/config/gradients";

const REST_API   = "https://en.wikipedia.org/api/rest_v1";
const ACTION_API = "https://en.wikipedia.org/w/api.php";

// Wikipedia API requires a descriptive User-Agent for production use
const WP_HEADERS = {
  "User-Agent": "EndlessWiki/1.0 (https://endless-wiki-scroll.vercel.app; namanmail4@gmail.com) next.js",
  "Api-User-Agent": "EndlessWiki/1.0",
};

// Strip HTML tags and decode all HTML entities from Wikipedia display titles
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

// Filter out maintenance/administrative categories — anything not meaningful to readers
const MAINTENANCE_PATTERN =
  /stubs?$|(^(Articles|Pages|CS1|Use |Coordinates|All |Wikipedia|Webarchive|Short |Good |Featured |Spoken |Harv and Sfn|Cleanup|Orphaned|Disputed|Accuracy|Bias|Dead|External links|Living people|Commons category|Commons-inline|Interlanguage link|Redirects|Nocat|Tracking|Template))/i;

// ─── Extract trimming ─────────────────────────────────────────────

function trimExtract(
  text: string,
  targetWords = 200
): { preview: string; full: string } {
  const full = text.trim();
  const words = full.split(/\s+/);
  if (words.length <= targetWords) return { preview: full, full };

  const rough = words.slice(0, targetWords + 20).join(" ");
  const cutoff = targetWords * 6;
  const sentenceEnd = rough.lastIndexOf(". ", cutoff);
  const preview =
    sentenceEnd > 0
      ? rough.slice(0, sentenceEnd + 1)
      : words.slice(0, targetWords).join(" ") + "…";

  return { preview, full };
}

// Fisher-Yates shuffle — used for category randomness
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
      { headers: WP_HEADERS, next: { revalidate: 3600 } }
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
    const res = await fetch(`${ACTION_API}?${params}`, { headers: WP_HEADERS });
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
      .slice(0, 6);

    return { categories, links };
  } catch {
    return { categories: [], links: [] };
  }
}

// Build related topics from link titles — no extra API calls needed
function buildRelatedTopics(linkTitles: string[]): RelatedTopic[] {
  return linkTitles.slice(0, 4).map((t) => ({
    title: t,
    pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}`,
  }));
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
  const relatedTopics = buildRelatedTopics(links);

  return {
    id: summary.pageid,
    title: summary.title,
    displayTitle: stripHtml(summary.displaytitle ?? summary.title),
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
  // Request extra to compensate for disambiguation/empty-extract rejections
  const fetchCount = Math.min(count + 5, 20);
  const params = new URLSearchParams({
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: String(fetchCount),
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${ACTION_API}?${params}`, { headers: WP_HEADERS, cache: "no-store" });
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
    .map((r) => r.value)
    .slice(0, count);
}

/** Fetch N articles from a specific Wikipedia category pool, randomly sampled.
 *  `slugPool` is an array of specific subcategory names — one is picked at
 *  random per call, then a random A-Z start key is applied on top, giving
 *  26 × pool.length distinct entry points into Wikipedia per topic.
 */
export async function getArticlesByCategory(
  slugPool: string | string[],
  count: number = 5
): Promise<WikiArticle[]> {
  const pool = Array.isArray(slugPool) ? slugPool : [slugPool];
  // Pick a random subcategory from the pool
  const categorySlug = pool[Math.floor(Math.random() * pool.length)];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomPrefix = alphabet[Math.floor(Math.random() * alphabet.length)];

  const poolSize = Math.min(count * 6, 50);

  async function fetchFromCategory(slug: string, prefix: string): Promise<string[]> {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${slug}`,
      cmnamespace: "0",
      cmtype: "page",           // articles only — skip subcategory entries
      cmlimit: String(poolSize),
      cmsort: "sortkey",
      cmstartsortkeyprefix: prefix,
      format: "json",
      origin: "*",
    });
    const res = await fetch(`${ACTION_API}?${params}`, { headers: WP_HEADERS, cache: "no-store" });
    const data = await res.json();
    return (data?.query?.categorymembers ?? []).map((p: { title: string }) => p.title);
  }

  let titles = await fetchFromCategory(categorySlug, randomPrefix);

  // If the random letter window is sparse, try a different letter in the same category
  if (titles.length < count) {
    const fallbackPrefix = alphabet[Math.floor(Math.random() * alphabet.length)];
    titles = await fetchFromCategory(categorySlug, fallbackPrefix);
  }

  // Still sparse? Try a different subcategory from the pool
  if (titles.length < count && pool.length > 1) {
    const fallbackSlug = pool.filter(s => s !== categorySlug)[
      Math.floor(Math.random() * (pool.length - 1))
    ];
    titles = await fetchFromCategory(fallbackSlug, randomPrefix);
  }

  const picked = shuffle(titles).slice(0, count + 5);
  const results = await Promise.allSettled(picked.map(enrichArticle));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WikiArticle> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
    .slice(0, count);
}
