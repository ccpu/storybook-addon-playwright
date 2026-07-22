/** Grouping used by list/search tools to organise actions. */
export type ActionCategory =
  | 'interaction'
  | 'mouse'
  | 'touch'
  | 'keyboard'
  | 'layout'
  | 'wait'
  | 'screenshot';

/** Documentation for a single argument accepted by an action. */
export interface ActionArg {
  /** Argument name as it appears inside the action's `args` object. */
  name: string;
  /** Display type, e.g. `string`, `number`, `{ x: number; y: number }`. */
  type: string;
  /** Whether the argument must be supplied for the action to run. */
  required?: boolean;
  /** Human-readable explanation of the argument. */
  description: string;
}

/**
 * Curated metadata for one action that can appear inside an action set of a
 * `*.stories.playwright.json` file. This is intentionally a hand-written,
 * addon-focused catalog rather than the raw Playwright schema — it documents the
 * exact `{ name, args }` shape the addon expects.
 */
export interface PlaywrightAction {
  /** Value used for the action's `name` field, e.g. `takeElementScreenshot`. */
  name: string;
  /** Group used by list/search tools. */
  category: ActionCategory;
  /** Concise summary of what the action does. */
  description: string;
  /** Whether the action captures an image (vs. only driving the page). */
  capturesScreenshot?: boolean;
  /** Documented arguments placed inside the action's `args` object. */
  args?: readonly ActionArg[];
  /** A ready-to-paste example action object. */
  example?: Record<string, unknown>;
  /** Extra usage guidance, gotchas, and related-action pointers. */
  notes?: readonly string[];
  /** Extra search terms that help discovery. */
  keywords?: readonly string[];
}

/** A curated guide section returned by the authoring-guide tool. */
export interface Guide {
  /** Stable identifier used as the `topic` argument. */
  id: string;
  /** Short human-readable heading. */
  title: string;
  /** Markdown body of the guide. */
  body: string;
  /** Search terms that help route a query to this guide. */
  keywords?: readonly string[];
}

/** Registry of actions keyed by action name. */
export type ActionRegistry = Record<string, PlaywrightAction>;
