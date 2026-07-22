import process from 'node:process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getAction,
  getExampleText,
  getGuideText,
  guideTopics,
  listActionsByCategory,
} from './content.js';
import { actions } from './data/actions.js';
import { searchActions } from './search.js';

const JSON_INDENT = 2;

/** Name reported to MCP clients. Specific to this addon so clients only surface it for visual-testing tasks. */
export const SERVER_NAME = 'storybook-playwright-screenshots';

/** Server-level description. Kept explicit about *when* to consult this server. */
export const SERVER_INSTRUCTIONS = `Authoring assistant for visual/screenshot regression tests built with the \`storybook-addon-playwright\` Storybook addon.

Consult this server ONLY when the user asks to add a story screenshot, add a visual/regression test for a component, or generate/take Playwright screenshots of a story. Do NOT consult it for unrelated Storybook or Playwright work.

It explains: the \`*.stories.playwright.json\` action-file format and naming, how to build action sets, how to select focused element screenshots with stable selectors, screenshot sizing/offset, and how images are generated. Start with \`get_screenshot_authoring_guide\`, then use \`search_playwright_actions\` / \`get_playwright_action\` for the action catalog.`;

function textResult(text: string, isError?: boolean) {
  return {
    content: [{ type: 'text' as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

function jsonResult<TData extends Record<string, unknown>>(data: TData) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, JSON_INDENT) }],
    structuredContent: data,
  };
}

/** Creates the MCP server and registers the guide/search/action tools. */
export function createServer(version: string): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version },
    { instructions: SERVER_INSTRUCTIONS },
  );

  server.registerTool(
    'get_screenshot_authoring_guide',
    {
      title: 'How to author a Storybook Playwright screenshot',
      description:
        'Read this FIRST when the user asks to add a story screenshot / visual test or generate Playwright screenshots. Returns the workflow and conventions for authoring a `*.stories.playwright.json` action file for the storybook-addon-playwright addon. Optionally pass a `topic` for a specific section.',
      inputSchema: {
        topic: z
          .string()
          .optional()
          .describe(
            `Optional guide section: ${guideTopics.join(', ')}, or "all". Omit for the overview + workflow + a topic index.`,
          ),
      },
    },
    async ({ topic }: { topic?: string }) => {
      const { text, isError } = getGuideText(topic);
      return textResult(text, isError);
    },
  );

  server.registerTool(
    'list_playwright_actions',
    {
      title: 'List Playwright actions',
      description:
        'List every action available inside a `*.stories.playwright.json` action set, grouped by category (screenshot, interaction, mouse, touch, keyboard, layout, wait).',
    },
    async () => jsonResult({ actionsByCategory: listActionsByCategory() }),
  );

  server.registerTool(
    'search_playwright_actions',
    {
      title: 'Search Playwright actions',
      description:
        'Search the action catalog by name, category, keywords, or description (e.g. "take element screenshot", "wait for toast", "drag"). Returns matches ranked by relevance. Use this to discover the right action instead of guessing.',
      inputSchema: {
        query: z
          .string()
          .describe('Free-text query; empty lists actions alphabetically.'),
        limit: z.number().int().min(1).optional(),
      },
    },
    async ({ query, limit }: { query: string; limit?: number }) =>
      jsonResult({ results: searchActions(actions, query, limit) }),
  );

  server.registerTool(
    'get_playwright_action',
    {
      title: 'Get Playwright action details',
      description:
        'Get the full detail for one action: its `args` shape, a ready-to-paste example `{ name, args }` object, and usage notes.',
      inputSchema: {
        name: z
          .string()
          .min(1)
          .describe('Exact action name, e.g. "takeElementScreenshot".'),
      },
    },
    async ({ name }: { name: string }) => {
      const action = getAction(name);

      if (!action) {
        return textResult(
          `Action "${name}" is not in the catalog. Use search_playwright_actions to find it.`,
          true,
        );
      }

      return jsonResult({ action });
    },
  );

  server.registerTool(
    'get_example_playwright_json',
    {
      title: 'Get an example action file',
      description:
        'Return a complete, realistic `*.stories.playwright.json` example (click a trigger, wait, then a focused element screenshot) with an explanation.',
    },
    async () => textResult(getExampleText()),
  );

  return server;
}

/** Starts the MCP server over stdio (used by the bin entrypoint). */
export async function startServer(version: string): Promise<void> {
  try {
    const server = createServer(version);
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to start ${SERVER_NAME} MCP server: ${message}`);
    process.exit(1);
  }
}
