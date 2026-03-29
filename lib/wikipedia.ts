import { WikiArticle, RelatedTopic } from "@/types/wiki";
import { colorSeedFromTitle } from "@/lib/config/gradients";

const REST_API   = "https://en.wikipedia.org/api/rest_v1";
const ACTION_API = "https://en.wikipedia.org/w/api.php";

const WP_HEADERS = {
  "User-Agent": "EndlessWiki/1.0 (https://endless-wiki-scroll.vercel.app; namanmail4@gmail.com) next.js",
  "Api-User-Agent": "EndlessWiki/1.0",
};

// Strip HTML tags and decode entities from Wikipedia display titles
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

// Filter out Wikipedia maintenance/admin categories — meaningless to readers
const MAINTENANCE_PATTERN =
  /stubs?$|(^(Articles|Pages|CS1|Use |Coordinates|All |Wikipedia|Webarchive|Short |Good |Featured |Spoken |Harv and Sfn|Cleanup|Orphaned|Disputed|Accuracy|Bias|Dead|External links|Living people|Commons category|Commons-inline|Interlanguage link|Redirects|Nocat|Tracking|Template))/i;

// ─── Extract trimming ────────────────────────────────────────────────────────

// preview: ~120 words shown in the card (always truncated so "Read more" appears)
// full: complete intro text shown when expanded
const PREVIEW_WORDS = 120;

function trimExtract(text: string): { preview: string; full: string } {
  const full = text.trim();
  const words = full.split(/\s+/);

  // Always build a preview capped at PREVIEW_WORDS so "Read more" shows
  // on any article with more than a couple of sentences.
  if (words.length <= PREVIEW_WORDS) return { preview: full, full };

  const rough = words.slice(0, PREVIEW_WORDS + 15).join(" ");
  const sentenceEnd = rough.lastIndexOf(". ", PREVIEW_WORDS * 6);
  const preview =
    sentenceEnd > 20
      ? rough.slice(0, sentenceEnd + 1)
      : words.slice(0, PREVIEW_WORDS).join(" ") + "…";

  return { preview, full };
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── REST summary ────────────────────────────────────────────────────────────

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

// ─── Action API: categories + links + full intro extract ────────────────────
// All three props in one request — no extra round trips.

interface RawCatLink {
  categories?: Array<{ title: string }>;
  links?: Array<{ ns: number; title: string }>;
  extract?: string;
}

async function fetchCategoriesLinksExtract(title: string): Promise<{
  categories: string[];
  links: string[];
  introText: string;
}> {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: title,
      prop: "categories|links|extracts",
      cllimit: "20",
      plnamespace: "0",
      pllimit: "10",
      exintro: "true",      // intro section only
      explaintext: "true",  // plain text, no HTML markup
      format: "json",
      origin: "*",
    });
    const res = await fetch(`${ACTION_API}?${params}`, { headers: WP_HEADERS });
    if (!res.ok) return { categories: [], links: [], introText: "" };
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

    const introText = page?.extract?.trim() ?? "";

    return { categories, links, introText };
  } catch {
    return { categories: [], links: [], introText: "" };
  }
}

function buildRelatedTopics(linkTitles: string[]): RelatedTopic[] {
  return linkTitles.slice(0, 4).map((t) => ({
    title: t,
    pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}`,
  }));
}

// ─── Article enrichment ──────────────────────────────────────────────────────

async function enrichArticle(title: string): Promise<WikiArticle | null> {
  const [summary, { categories, links, introText }] = await Promise.all([
    fetchSummary(title),
    fetchCategoriesLinksExtract(title),
  ]);

  if (!summary || summary.type === "disambiguation") return null;

  // Quality filter: skip stubs (too short to be interesting)
  const rawExtract = summary.extract?.trim() ?? "";
  if (rawExtract.length < 120) return null;

  // Use the Action API intro if it's richer than the REST summary extract
  const bestExtract =
    introText.length > rawExtract.length ? introText : rawExtract;

  const { preview, full } = trimExtract(bestExtract);
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

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch a single article by exact Wikipedia title. Used for related deep dive. */
export async function getArticleByTitle(
  title: string
): Promise<WikiArticle | null> {
  return enrichArticle(title);
}

/** Fetch N random articles. 40% drawn from Featured articles for quality. */
export async function getRandomArticles(
  count: number = 5
): Promise<WikiArticle[]> {
  // 40% of the time pull from Featured articles — well-written, interesting
  if (Math.random() < 0.4) {
    return getArticlesByCategory(["Featured_articles"], count);
  }

  const fetchCount = Math.min(count + 8, 20);
  const params = new URLSearchParams({
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: String(fetchCount),
    format: "json",
    origin: "*",
  });

  const res = await fetch(`${ACTION_API}?${params}`, {
    headers: WP_HEADERS,
    cache: "no-store",
  });
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

/** Fetch N articles from a pool of specific Wikipedia subcategories.
 *  One subcategory is picked at random per call + random A-Z start key
 *  → ~26 × pool.length distinct entry points per topic.
 */
export async function getArticlesByCategory(
  slugPool: string | string[],
  count: number = 5
): Promise<WikiArticle[]> {
  const pool = Array.isArray(slugPool) ? slugPool : [slugPool];
  const categorySlug = pool[Math.floor(Math.random() * pool.length)];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomPrefix = alphabet[Math.floor(Math.random() * alphabet.length)];

  const poolSize = Math.min(count * 6, 50);

  async function fetchFromCategory(
    slug: string,
    prefix: string
  ): Promise<string[]> {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${slug}`,
      cmnamespace: "0",
      cmtype: "page",
      cmlimit: String(poolSize),
      cmsort: "sortkey",
      cmstartsortkeyprefix: prefix,
      format: "json",
      origin: "*",
    });
    const res = await fetch(`${ACTION_API}?${params}`, {
      headers: WP_HEADERS,
      cache: "no-store",
    });
    const data = await res.json();
    return (data?.query?.categorymembers ?? []).map(
      (p: { title: string }) => p.title
    );
  }

  let titles = await fetchFromCategory(categorySlug, randomPrefix);

  // Sparse letter window — try a different letter
  if (titles.length < count) {
    const fallbackPrefix =
      alphabet[Math.floor(Math.random() * alphabet.length)];
    titles = await fetchFromCategory(categorySlug, fallbackPrefix);
  }

  // Still sparse — try a different subcategory from the pool
  if (titles.length < count && pool.length > 1) {
    const others = pool.filter((s) => s !== categorySlug);
    const fallbackSlug = others[Math.floor(Math.random() * others.length)];
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
