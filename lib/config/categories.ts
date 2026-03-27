// Curated topic categories for the filter bar.
// slug maps to the Wikipedia category title used in the API call.
// null slug = random (default / "All" mode).

export interface Category {
  label: string
  slug: string | null
}

export const CATEGORIES: Category[] = [
  { label: 'All',         slug: null },
  { label: 'Science',     slug: 'Science' },
  { label: 'History',     slug: 'History' },
  { label: 'Geography',   slug: 'Geography' },
  { label: 'Technology',  slug: 'Technology' },
  { label: 'Philosophy',  slug: 'Philosophy' },
  { label: 'Mathematics', slug: 'Mathematics' },
  { label: 'Biography',   slug: 'Biographical_articles' },
  { label: 'Nature',      slug: 'Nature' },
  { label: 'Culture',     slug: 'Culture' },
  { label: 'Sports',      slug: 'Sports' },
  { label: 'Music',       slug: 'Music' },
  { label: 'Film',        slug: 'Films' },
  { label: 'Space',       slug: 'Astronomy' },
  { label: 'Medicine',    slug: 'Medicine' },
  { label: 'Food',        slug: 'Food_and_drink' },
  { label: 'Economics',   slug: 'Economics' },
  { label: 'Arts',        slug: 'Arts' },
]
