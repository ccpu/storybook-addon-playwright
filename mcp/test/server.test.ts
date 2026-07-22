import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { createServer } from '../src/server.js';

async function connectClient(): Promise<Client> {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer('0.0.0-test');
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

function firstText(result: { content: Array<{ type: string; text?: string }> }): string {
  const entry = result.content.find((c) => c.type === 'text');
  return entry?.text ?? '';
}

describe('createServer (MCP wiring)', () => {
  let client: Client;

  beforeAll(async () => {
    client = await connectClient();
  });

  it('registers the expected tools', async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        'get_example_playwright_json',
        'get_playwright_action',
        'get_screenshot_authoring_guide',
        'list_playwright_actions',
        'search_playwright_actions',
      ].sort(),
    );
  });

  it('returns the authoring guide', async () => {
    const result = await client.callTool({
      name: 'get_screenshot_authoring_guide',
      arguments: {},
    });
    expect(firstText(result as never)).toContain('storybook-addon-playwright');
  });

  it('searches actions', async () => {
    const result = (await client.callTool({
      name: 'search_playwright_actions',
      arguments: { query: 'element screenshot' },
    })) as { structuredContent?: { results: Array<{ name: string }> } };
    const names = result.structuredContent?.results.map((r) => r.name) ?? [];
    expect(names).toContain('takeElementScreenshot');
  });

  it('gets a single action detail', async () => {
    const result = (await client.callTool({
      name: 'get_playwright_action',
      arguments: { name: 'takeElementScreenshot' },
    })) as { structuredContent?: { action: { name: string } } };
    expect(result.structuredContent?.action.name).toBe('takeElementScreenshot');
  });

  it('reports an error for an unknown action', async () => {
    const result = (await client.callTool({
      name: 'get_playwright_action',
      arguments: { name: 'nope' },
    })) as { isError?: boolean };
    expect(result.isError).toBe(true);
  });
});
