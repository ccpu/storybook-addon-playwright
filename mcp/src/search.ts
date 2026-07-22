import type { PlaywrightAction } from './types.js';

/** A single ranked match returned by {@link searchActions}. */
export interface ActionSearchResult {
  /** Action name (its `name` field in the JSON). */
  name: string;
  /** Category the action belongs to. */
  category: string;
  /** Concise summary of what the action does. */
  description: string;
  /** Whether the action captures an image. */
  capturesScreenshot: boolean;
  /** Relevance score; higher is a stronger match. `0` in query-less list mode. */
  score: number;
}

/** Default number of results returned when the caller does not pass a limit. */
export const DEFAULT_SEARCH_LIMIT = 10;

/** Maximum edit distance still treated as a likely typo of an action name. */
const MAX_TYPO_DISTANCE = 2;

/** Points awarded for each kind of match, tuned so stronger signals win. */
const SCORE = {
  nameExact: 100,
  namePrefix: 50,
  nameIncludes: 30,
  keywordExact: 40,
  categoryExact: 25,
  categoryIncludes: 10,
  tokenName: 8,
  tokenKeyword: 6,
  tokenDescription: 3,
  fuzzyName: 15,
} as const;

function toResult(action: PlaywrightAction, score: number): ActionSearchResult {
  return {
    name: action.name,
    category: action.category,
    description: action.description,
    capturesScreenshot: Boolean(action.capturesScreenshot),
    score,
  };
}

function scoreAction(
  action: PlaywrightAction,
  query: string,
  tokens: readonly string[],
): number {
  const name = action.name.toLowerCase();
  const category = action.category.toLowerCase();
  const description = action.description.toLowerCase();
  const keywords = (action.keywords ?? []).map((keyword) => keyword.toLowerCase());

  let score = 0;

  // 1. Name match — the strongest signal, graded by how tight the match is.
  if (name === query) score += SCORE.nameExact;
  else if (name.startsWith(query)) score += SCORE.namePrefix;
  else if (name.includes(query)) score += SCORE.nameIncludes;

  // 2. Exact keyword match.
  if (keywords.includes(query)) score += SCORE.keywordExact;

  // 3. Category match.
  if (category === query) score += SCORE.categoryExact;
  else if (category.includes(query)) score += SCORE.categoryIncludes;

  // 4. Per-token matching so multi-word queries ("wait for toast", "focus ring")
  //    still score against name, keywords, and description.
  for (const token of tokens) {
    if (name.includes(token)) score += SCORE.tokenName;
    if (keywords.some((keyword) => keyword.includes(token))) score += SCORE.tokenKeyword;
    if (description.includes(token)) score += SCORE.tokenDescription;
  }

  // 5. Light typo tolerance on the name only — cheap, and high value for a
  //    single mistyped action name ("hovr" -> "hover").
  if (score === 0 && levenshtein(query, name) <= MAX_TYPO_DISTANCE) {
    score += SCORE.fuzzyName;
  }

  return score;
}

/**
 * Smart, dependency-free search over the action catalog.
 *
 * With an empty query it acts as an alphabetical list; otherwise it ranks
 * actions by name, keyword, category, and description matches, with light typo
 * tolerance on the name. Results are capped at `limit`.
 */
export function searchActions(
  catalog: readonly PlaywrightAction[],
  query: string,
  limit: number = DEFAULT_SEARCH_LIMIT,
): ActionSearchResult[] {
  const max = Math.max(0, Math.trunc(limit));
  const normalizedQuery = query.trim().toLowerCase();

  // No query: list mode. Alphabetical, no scoring needed.
  if (!normalizedQuery) {
    return [...catalog]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, max)
      .map((action) => toResult(action, 0));
  }

  const tokens = normalizedQuery.split(/\s+/u).filter(Boolean);

  return (
    catalog
      .map((action) => toResult(action, scoreAction(action, normalizedQuery, tokens)))
      .filter((result) => result.score > 0)
      // Rank by score, then break ties alphabetically for stable output.
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, max)
  );
}

/** Small, dependency-free Levenshtein distance for typo tolerance. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Single rolling row instead of a full matrix; `diagonal` carries dp[i-1][j-1].
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0] ?? 0; // dp[i-1][0]
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j] ?? 0; // dp[i-1][j], overwritten below
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(
        above + 1, // deletion
        (row[j - 1] ?? 0) + 1, // insertion
        diagonal + cost, // substitution
      );
      diagonal = above;
    }
  }

  return row[b.length] ?? 0;
}
