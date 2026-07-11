/**
 * `search_components` domain logic — adapter-independent (no SDK import).
 *
 * Ranks the catalogue by natural-language intent plus optional hard facet
 * filters, using `@enterprise-design/search` for all matching/filtering/ranking.
 * Returns a structured {@link ToolOutcome}: a truncated page with the true
 * total on success, or a contracts `INVALID_INPUT` `McpError`. A query that
 * matches nothing is NOT an error — it returns empty results with a note.
 */
import { search } from '@enterprise-design/search';
import { SearchComponentsInput, type SearchComponentResult, type SearchComponentsOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

export function searchComponents(registry: RegistryData, rawInput: unknown): ToolOutcome<SearchComponentsOutput> {
  const requestId = newRequestId();

  const parsed = SearchComponentsInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for search_components.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ["Provide a string 'query'; 'limit' must be an integer between 1 and 50."],
      }),
    };
  }

  const { query, filters, entityTypes, limit } = parsed.data;

  // Run the search WITHOUT a limit so we know the true match total, then
  // truncate ourselves — the package still owns filtering and ranking.
  const matched = search(registry.searchIndex, query, { entityTypes, filters });
  const page = matched.slice(0, limit);

  const results: SearchComponentResult[] = page.map((hit) => ({
    id: hit.id,
    entityType: hit.entityType,
    title: hit.title,
    summary: hit.summary,
    score: hit.score,
    matchedTerms: hit.matchedTerms,
    facets: hit.facets,
  }));

  let note: string | undefined;
  if (matched.length === 0) {
    note = 'No components matched. Try broader keywords or remove filters.';
  } else if (matched.length > page.length) {
    note = `Showing ${page.length} of ${matched.length} matches.`;
  }

  const data: SearchComponentsOutput = { results, totalMatched: matched.length };
  if (note !== undefined) data.note = note;

  return { ok: true, data };
}
