import type { GenerateScreenshotTitleInput } from '../schema';

export interface CreateScreenshotTitlePromptOptions {
  /**
   * Maximum number of characters allowed in the returned title.
   * Note: the generated title is also truncated in code as a safety net,
   * since LLMs count tokens, not characters.
   *
   * @default 80
   */
  maxTitleLength?: number;

  /**
   * Fallback title the model should use when input is too sparse to produce
   * a meaningful title (no changedArgs, no actions, and story.name is absent
   * or a single generic word).
   *
   * @default 'Should render correctly.'
   */
  fallbackTitle?: string;

  /**
   * Whether the generated title should include the browser type when useful.
   *
   * @default true
   */
  includeBrowserType?: boolean;

  /**
   * Whether the generated title can include the story id.
   *
   * @default false
   */
  includeStoryId?: boolean;

  /**
   * Additional instructions for the output format, appended to the prompt's
   * output contract section.
   *
   * @default 'Return only the generated title as a plain text string, without
   * any additional text, reasoning, or formatting.'
   */
  outputPrompt?: string | string[];
}

type PartialContext = Partial<GenerateScreenshotTitleInput> &
  Pick<GenerateScreenshotTitleInput, 'story'>;

type ScreenshotTitleFieldGuide = {
  story: Record<keyof GenerateScreenshotTitleInput['story'], string>;
  browser: Record<keyof GenerateScreenshotTitleInput['browser'], string>;
  screenshotOptions: string;
};

const DEFAULT_OPTIONS: Required<CreateScreenshotTitlePromptOptions> = {
  fallbackTitle: 'Should render correctly.',
  includeBrowserType: true,
  includeStoryId: false,
  maxTitleLength: 80,
  outputPrompt:
    'Return only the generated title as a plain text string, without any additional text, reasoning, or formatting.',
};

const INPUT_JSON_INDENT = 2;
const MIN_TITLE_LENGTH = 10;

const storyGuide = {
  changedArgs:
    'The arguments explicitly changed from their defaults for this story. ' +
    'This is the single highest-priority field — always prefer these details ' +
    'when building the title.',

  initialArgs:
    'The default arguments for the story. Use these only when changedArgs is ' +
    'empty or absent, to understand the base state of the component.',

  argTypes:
    'Metadata about the story arguments. Consult this only when the meaning ' +
    'of a changedArgs value is unclear without extra context.',

  name:
    'The display name of the story (e.g. "Primary Button"). Use as the ' +
    'component anchor when changedArgs and actions are both absent.',

  title:
    'The hierarchical Storybook path in the format "Group/Component/Variant" ' +
    '(e.g. "Forms/Button/Disabled"). The rightmost segment is the most ' +
    'specific and useful; earlier segments provide grouping context only.',

  parameters:
    'Storybook-level metadata. Only relevant when it directly affects what ' +
    'the screenshot shows — for example a viewport override, a forced ' +
    'background colour, or a locale setting. Ignore generic infrastructure keys.',

  filePath:
    'The source file path of the story. Use only as a last resort to infer ' +
    'the component or feature name when no other field provides it.',

  id:
    'The unique story identifier. Include in the title only when no other ' +
    'field provides enough uniqueness and includeStoryId is permitted.',

  actions:
    'An ordered sequence of Playwright page interactions — called an action ' +
    'set — executed on the page immediately before the screenshot was taken. ' +
    'Each entry is a discrete action such as mouseMove, mouseDown, click, ' +
    'press, scroll, dragDrop, hover, or a custom page extension. Together ' +
    'they define the exact UI state captured (e.g. "after hovering a tooltip" ' +
    'or "after dragging the slider to max"). When present, describe the ' +
    'resulting UI state rather than listing the individual action names. ' +
    'Treat this as a high-priority field alongside changedArgs.',
} satisfies ScreenshotTitleFieldGuide['story'];

const browserGuide = {
  type:
    'The Playwright browser engine used: chromium, firefox, or webkit. ' +
    'Include in the title only when cross-browser differences are the point ' +
    'of the screenshot (e.g. a webkit-specific rendering bug).',

  options:
    'Browser or device options such as viewport dimensions and device ' +
    'profile. Include when they meaningfully change the visual output — ' +
    'e.g. a mobile viewport that triggers a responsive layout shift.',
} satisfies ScreenshotTitleFieldGuide['browser'];

const screenshotOptionsGuide =
  'Options that control how the screenshot is captured and may change its ' +
  'meaning: fullPage (captures beyond the visible viewport), clip (captures ' +
  'a specific region), animations (disabled/enabled), mask (hides elements), ' +
  'omitBackground (transparent background). Mention these in the title only ' +
  'when they are the distinguishing factor of this screenshot.';

const fieldGuide: ScreenshotTitleFieldGuide = {
  story: storyGuide,
  browser: browserGuide,
  screenshotOptions: screenshotOptionsGuide,
};

// ---------------------------------------------------------------------------
// Few-shot examples embedded in the prompt
// ---------------------------------------------------------------------------
const FEW_SHOT_EXAMPLES = `\
Examples (input → output):

Input: {"story":{"name":"Button","changedArgs":{"variant":"destructive","disabled":true}}}
Output: Button - Destructive and Disabled

Input: {"story":{"name":"Tooltip","changedArgs":{}},"actions":[{"type":"mouseMove","selector":"#trigger"}]}
Output: Tooltip visible on trigger hover

Input: {"story":{"name":"Slider","changedArgs":{"min":0,"max":100}},"actions":[{"type":"dragDrop","selector":"#thumb","position":{"x":300,"y":0}}]}
Output: Slider thumb dragged to far right

Input: {"story":{"name":"Modal","changedArgs":{"open":true}},"browser":{"type":"firefox"}}
Output: Modal open (Firefox)

Input: {"story":{"name":"Card"},"browser":{"type":"webkit","options":{"viewport":{"width":375,"height":812}}}}
Output: Card on mobile viewport (WebKit)

Input: {"story":{"name":"A"}}
Output: Should render correctly.`;

function hasOwnDefinedValue<T extends object, K extends keyof T>(
  value: T,
  key: K,
): boolean {
  return value[key] !== undefined;
}

function normalizeOptions(
  options: CreateScreenshotTitlePromptOptions = {},
): Required<CreateScreenshotTitlePromptOptions> {
  const maxTitleLength = Number.isFinite(options.maxTitleLength)
    ? Math.max(MIN_TITLE_LENGTH, Math.floor(options.maxTitleLength as number))
    : DEFAULT_OPTIONS.maxTitleLength;

  const outputPrompt = (
    Array.isArray(options.outputPrompt)
      ? options.outputPrompt
      : typeof options.outputPrompt === 'string'
        ? [options.outputPrompt]
        : [DEFAULT_OPTIONS.outputPrompt]
  )
    .map((instruction) => (instruction as string).trim())
    .map((x) => '- ' + x);

  return {
    fallbackTitle:
      typeof options.fallbackTitle === 'string' && options.fallbackTitle.trim()
        ? options.fallbackTitle.trim()
        : DEFAULT_OPTIONS.fallbackTitle,
    includeBrowserType: options.includeBrowserType ?? DEFAULT_OPTIONS.includeBrowserType,
    includeStoryId: options.includeStoryId ?? DEFAULT_OPTIONS.includeStoryId,
    maxTitleLength,
    outputPrompt,
  };
}

/**
 * Truncates a generated title to the configured maximum length, appending
 * an ellipsis if the string was cut. This acts as a safety net because LLMs
 * count tokens rather than characters and may slightly exceed the limit.
 */
export function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Creates a prompt for LLMs to generate a screenshot title from Storybook
 * Playwright data.
 *
 * The prompt instructs the model to return the title as a plain text string
 * with no additional text or formatting. Use {@link truncateTitle} as a
 * client-side safety net in case the model slightly exceeds maxTitleLength.
 */
export function createScreenshotTitlePrompt(
  context: PartialContext,
  options?: CreateScreenshotTitlePromptOptions,
): string {
  const resolved = normalizeOptions(options);
  const inputJson = JSON.stringify(context, null, INPUT_JSON_INDENT);
  const fieldGuideSections: string[] = ['Field guide:'];

  if (hasOwnDefinedValue(context, 'story') && context.story) {
    fieldGuideSections.push(
      ...Object.entries(fieldGuide.story).map(
        ([key, description]) => `- story.${key}: ${description}`,
      ),
    );
  }

  if (hasOwnDefinedValue(context, 'browser') && context.browser) {
    fieldGuideSections.push(
      ...Object.entries(fieldGuide.browser).map(
        ([key, description]) => `- browser.${key}: ${description}`,
      ),
    );
  }

  if (hasOwnDefinedValue(context, 'screenshotOptions') && context.screenshotOptions) {
    fieldGuideSections.push(`- screenshotOptions: ${fieldGuide.screenshotOptions}`);
  }

  fieldGuideSections.push('');

  return [
    'You are a screenshot title generator for Storybook Playwright.',
    'Your goal is to read the input JSON and produce one clear screenshot title.',
    '',
    'Follow this process INTERNALLY before writing the final answer.',
    'Do NOT output your reasoning, intermediate steps, or any text other than the final title:',
    '1) Parse INPUT_JSON.',
    '2) Identify the highest-priority signals using the field guide and priority chain below.',
    '3) Build a short, human-friendly title following the title rules.',
    '4) Output ONLY the final title.',
    '',
    ...fieldGuideSections,

    // -----------------------------------------------------------------------
    // Priority chain
    // -----------------------------------------------------------------------
    'Priority chain (use the first level that provides meaningful content):',
    '  1. actions + changedArgs   (what the user did AND what changed)',
    '  2. actions alone           (describe the resulting UI state)',
    '  3. changedArgs alone       (describe the changed configuration)',
    '  4. story.name              (use as a component anchor)',
    '  5. story.title rightmost segment',
    '  6. filePath component/feature name',
    `  7. Fallback title: ${JSON.stringify(resolved.fallbackTitle)}`,
    '     (use ONLY when no changedArgs, no actions, and story.name is absent or a single generic word)',
    '',

    // -----------------------------------------------------------------------
    // Title rules
    // -----------------------------------------------------------------------
    'Title rules:',
    `- Maximum length: ${resolved.maxTitleLength} characters (hard limit — the output will be truncated in code if exceeded).`,
    `- ${resolved.includeBrowserType ? 'Include browser type only when it adds useful context (e.g. a browser-specific rendering difference).' : 'Do not include browser type in the title.'}`,
    `- ${resolved.includeStoryId ? 'You may include story.id when needed for uniqueness.' : 'Do not include story.id unless no other unique context exists.'}`,
    '- Prefer changedArgs and actions details when present.',
    '- Avoid filler words and generic phrases.',
    '- Title must be plain text: no markdown, no surrounding quotes.',
    '- Use sentence case with a capital first letter. End with a period only if the title is a full sentence.',
    '',

    // -----------------------------------------------------------------------
    // Title style contract
    // -----------------------------------------------------------------------
    'Title style contract:',
    '- Prefer UI state over component names (e.g. "Dropdown open" not "Dropdown component").',
    '- Prefer observable behavior over configuration (e.g. "Error message visible" not "hasError=true").',
    '- Prefer post-action result when actions are present (e.g. "Tooltip shown after hover" not "mouseMove on tooltip trigger").',
    '- Avoid generic terms: "renders correctly", "display", "view", "screenshot", "story", "component".',
    '',
    'Examples of BAD titles:',
    '- "Component with some changes"   ← too generic, no specifics',
    '- "Story screenshot"              ← pure filler',
    '- "mouseMove, click"              ← lists actions instead of describing result',
    '- "Button renders correctly"      ← generic fallback used when real content exists',
    '',

    // -----------------------------------------------------------------------
    // Few-shot examples
    // -----------------------------------------------------------------------
    FEW_SHOT_EXAMPLES,
    '',

    // -----------------------------------------------------------------------
    // Output contract
    // -----------------------------------------------------------------------
    'Output contract (strict):',
    '- Output ONLY the final title.',
    '- Do NOT output your internal thinking, reasoning steps, or any introductory text.',
    '- Do NOT wrap the title in quotes, markdown, or JSON.',
    ...resolved.outputPrompt,
    `- If context is insufficient (no changedArgs, no actions, story.name absent or generic), use fallback: ${JSON.stringify(resolved.fallbackTitle)}`,
    '',

    // -----------------------------------------------------------------------
    // Input
    // -----------------------------------------------------------------------
    'INPUT_JSON:',
    inputJson,
  ].join('\n');
}
