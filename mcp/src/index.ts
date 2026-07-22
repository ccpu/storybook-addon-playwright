/** Public entry for programmatic use of the MCP server. */
export { createServer, startServer, SERVER_NAME, SERVER_INSTRUCTIONS } from './server.js';
export {
  getAction,
  getExampleText,
  getGuideText,
  guideTopics,
  listActionsByCategory,
  actionRegistry,
} from './content.js';
export { searchActions, DEFAULT_SEARCH_LIMIT } from './search.js';
export type { ActionSearchResult } from './search.js';
export { actions } from './data/actions.js';
export { guides } from './data/guides.js';
export type * from './types.js';
