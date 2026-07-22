import type { ActionRegistry, Guide, PlaywrightAction } from './types.js';
import { actions } from './data/actions.js';
import { exampleExplanation, exampleFile, exampleFileName } from './data/example.js';
import { guides } from './data/guides.js';

const JSON_INDENT = 2;

/** Action catalog keyed by action name. */
export const actionRegistry: ActionRegistry = Object.fromEntries(
  actions.map((action) => [action.name, action]),
);

/** Every guide keyed by its topic id. */
const guideById: Record<string, Guide> = Object.fromEntries(
  guides.map((guide) => [guide.id, guide]),
);

/** Valid `topic` values for the authoring-guide tool. */
export const guideTopics: readonly string[] = guides.map((guide) => guide.id);

/** Look up a single action by its exact name. */
export function getAction(name: string): PlaywrightAction | undefined {
  return Object.hasOwn(actionRegistry, name) ? actionRegistry[name] : undefined;
}

/** Group action names by category for the list tool. */
export function listActionsByCategory(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const action of actions) {
    (grouped[action.category] ??= []).push(action.name);
  }

  for (const names of Object.values(grouped)) {
    names.sort((a, b) => a.localeCompare(b));
  }

  return grouped;
}

const guideIndex = guides.map((guide) => `- \`${guide.id}\` — ${guide.title}`).join('\n');

/**
 * Build the markdown response for the authoring-guide tool.
 *
 * - no topic  → overview + workflow + an index of the remaining topics;
 * - `all`     → every guide concatenated;
 * - a topic   → that single guide;
 * - unknown   → an error listing the valid topics.
 */
export function getGuideText(topic?: string): { text: string; isError?: boolean } {
  if (!topic) {
    const overview = guideById.overview?.body ?? '';
    const workflow = guideById.workflow?.body ?? '';

    return {
      text: `${overview}\n\n---\n\n${workflow}\n\n---\n\n## More topics\n\nCall this tool again with a \`topic\` for detail:\n\n${guideIndex}`,
    };
  }

  if (topic === 'all') {
    return {
      text: guides.map((guide) => guide.body).join('\n\n---\n\n'),
    };
  }

  const guide = guideById[topic];

  if (!guide) {
    return {
      isError: true,
      text: `Unknown topic "${topic}". Valid topics: ${guideTopics.join(', ')}, all.`,
    };
  }

  return { text: guide.body };
}

/** Build the markdown response for the example tool. */
export function getExampleText(): string {
  const json = JSON.stringify(exampleFile, null, JSON_INDENT);

  return `# Example: \`${exampleFileName}\`\n\n\`\`\`json\n${json}\n\`\`\`\n\n${exampleExplanation}`;
}
