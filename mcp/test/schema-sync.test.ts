import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { actions } from '../src/data/actions.js';

/**
 * Source of truth: the addon's generated action schema, which is produced from
 * the `PlaywrightPage` interface in `src/api/typings/schema-types.ts` via
 * `scripts/playwright/generate-action-schema.ts`. These tests fail if the MCP
 * action catalog drifts from that schema — e.g. a new action is added to
 * `PlaywrightPage`, an action is renamed/removed, or a documented argument no
 * longer exists / changes its required-ness.
 */
const schemaUrl = new URL(
  '../../src/api/server/data/action-schema.json',
  import.meta.url,
);
const schema = JSON.parse(readFileSync(schemaUrl, 'utf8')) as Record<string, SchemaNode>;

interface SchemaNode {
  kind?: string;
  type?: string;
  parameters?: Record<string, SchemaNode>;
  properties?: Record<string, SchemaNode>;
  required?: string[];
}

/** All invokable action names in the schema, expanding nested mouse/keyboard/touchscreen groups. */
function enumerateSchemaActions(): Map<string, SchemaNode> {
  const found = new Map<string, SchemaNode>();

  for (const [key, node] of Object.entries(schema)) {
    if (node.kind === 'function') {
      found.set(key, node);
    } else if (node.type === 'object' && node.properties) {
      for (const [subKey, subNode] of Object.entries(node.properties)) {
        if (subNode.kind === 'function') found.set(`${key}.${subKey}`, subNode);
      }
    }
  }

  return found;
}

/** Resolve a dotted argument path (e.g. `options.offset`) against a parameters tree. */
function resolveArgPath(
  parameters: Record<string, SchemaNode> | undefined,
  path: string,
): SchemaNode | undefined {
  const segments = path.split('.');
  let node: SchemaNode | undefined = parameters?.[segments[0]];

  for (const segment of segments.slice(1)) {
    node = node?.properties?.[segment];
  }

  return node;
}

const schemaActions = enumerateSchemaActions();

describe('MCP action catalog is in sync with the addon action schema', () => {
  it('documents exactly the actions the addon exposes (no more, no less)', () => {
    const catalogNames = actions.map((a) => a.name).sort();
    const schemaNames = [...schemaActions.keys()].sort();

    const missingFromCatalog = schemaNames.filter((n) => !catalogNames.includes(n));
    const extraInCatalog = catalogNames.filter((n) => !schemaNames.includes(n));

    expect(
      missingFromCatalog,
      `Actions defined in PlaywrightPage but missing from mcp/src/data/actions.ts: ${missingFromCatalog.join(', ')}`,
    ).toEqual([]);
    expect(
      extraInCatalog,
      `Actions documented in mcp/src/data/actions.ts that no longer exist in the schema: ${extraInCatalog.join(', ')}`,
    ).toEqual([]);
  });

  it('only documents arguments that exist in the schema', () => {
    for (const action of actions) {
      const node = schemaActions.get(action.name);
      if (!node) continue; // covered by the coverage test above

      for (const arg of action.args ?? []) {
        const resolved = resolveArgPath(node.parameters, arg.name);
        expect(
          resolved,
          `Action "${action.name}" documents arg "${arg.name}" which does not exist in the schema.`,
        ).toBeDefined();
      }
    }
  });

  it('covers every argument the schema marks as required', () => {
    for (const action of actions) {
      const node = schemaActions.get(action.name);
      if (!node) continue;

      const documentedTopLevel = new Set(
        (action.args ?? []).map((arg) => arg.name.split('.')[0]),
      );

      for (const requiredName of node.required ?? []) {
        expect(
          documentedTopLevel.has(requiredName),
          `Action "${action.name}" does not document required arg "${requiredName}".`,
        ).toBe(true);
      }
    }
  });

  it('does not mark an argument required unless the schema does', () => {
    for (const action of actions) {
      const node = schemaActions.get(action.name);
      if (!node) continue;

      const required = new Set(node.required ?? []);

      for (const arg of action.args ?? []) {
        // Only cross-check top-level args; nested props carry their own required rules.
        if (arg.required && !arg.name.includes('.')) {
          expect(
            required.has(arg.name),
            `Action "${action.name}" marks arg "${arg.name}" required, but the schema does not.`,
          ).toBe(true);
        }
      }
    }
  });
});
