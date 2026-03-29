// Curated topic categories for the filter bar.
// Each topic maps to several specific, article-rich Wikipedia subcategories.
// On every request one is picked at random — combined with a random A-Z start
// key this gives thousands of distinct entry points into Wikipedia.
// null slugs = random (default "All" mode).

export interface Category {
  label: string
  slug: string | null        // null = All / random
  pool?: string[]            // specific Wikipedia category slugs to draw from
}

export const CATEGORIES: Category[] = [
  { label: 'All', slug: null },

  {
    label: 'Science',
    slug: 'science',
    pool: [
      'Physics', 'Chemistry', 'Biology', 'Geology',
      'Neuroscience', 'Microbiology', 'Ecology', 'Genetics',
      'Biochemistry', 'Quantum_mechanics',
    ],
  },
  {
    label: 'History',
    slug: 'history',
    pool: [
      'World_War_II', 'World_War_I', 'Ancient_Rome', 'Ancient_Greece',
      'Ancient_Egypt', 'Cold_War', 'History_of_science',
      'Byzantine_Empire', 'Medieval_history', 'Colonialism',
    ],
  },
  {
    label: 'Nature',
    slug: 'nature',
    pool: [
      'Birds', 'Mammals', 'Insects', 'Reptiles',
      'Amphibians', 'Fish', 'Flowering_plants', 'Fungi',
      'Marine_biology', 'Trees',
    ],
  },
  {
    label: 'Space',
    slug: 'space',
    pool: [
      'Stars', 'Galaxies', 'Nebulae', 'Exoplanets',
      'Space_missions', 'Astronauts', 'Planetary_science',
      'Comets', 'Supernovae', 'Black_holes',
    ],
  },
  {
    label: 'Technology',
    slug: 'technology',
    pool: [
      'Computer_science', 'Software', 'Telecommunications',
      'Robotics', 'Artificial_intelligence', 'Cryptography',
      'Mechanical_engineering', 'Electronics', 'Internet',
    ],
  },
  {
    label: 'People',
    slug: 'people',
    pool: [
      'Scientists', 'Mathematicians', 'Explorers', 'Inventors',
      'Architects', 'Philosophers', 'Economists',
      'Military_leaders', 'Monarchs', 'Revolutionaries',
    ],
  },
  {
    label: 'Arts',
    slug: 'arts',
    pool: [
      'Painting', 'Sculpture', 'Photography', 'Drawing',
      'Printmaking', 'Architecture', 'Ceramics',
      'Street_art', 'Conceptual_art', 'Surrealism',
    ],
  },
  {
    label: 'Music',
    slug: 'music',
    pool: [
      'Rock_music', 'Jazz', 'Classical_music', 'Hip_hop_music',
      'Electronic_music', 'Folk_music', 'Opera',
      'Soul_music', 'Blues', 'Punk_rock',
    ],
  },
  {
    label: 'Film',
    slug: 'film',
    pool: [
      'Drama_films', 'Science_fiction_films', 'Action_films',
      'Horror_films', 'Animated_films', 'Thriller_films',
      'Documentary_films', 'Crime_films', 'Comedy_films',
    ],
  },
  {
    label: 'Sports',
    slug: 'sports',
    pool: [
      'Association_football', 'Basketball', 'Tennis', 'Cricket',
      'Athletics_(sport)', 'Swimming', 'Cycling', 'Combat_sports',
      'Rugby_union', 'Baseball',
    ],
  },
  {
    label: 'Food',
    slug: 'food',
    pool: [
      'Breads', 'Cheeses', 'Fruits', 'Vegetables',
      'Cocktails', 'Sauces', 'Soups', 'Desserts',
      'Fermented_foods', 'Street_food',
    ],
  },
  {
    label: 'Philosophy',
    slug: 'philosophy',
    pool: [
      'Philosophers', 'Logic', 'Ethics', 'Epistemology',
      'Metaphysics', 'Philosophy_of_mind', 'Aesthetics',
      'Political_philosophy', 'Philosophy_of_science',
    ],
  },
]
