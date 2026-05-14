import type { GenerateScreenshotTitleInput } from '../schema';

export interface CreateScreenshotTitlePromptOptions {
  /**
   * Maximum number of characters allowed in the returned title.
   *
   * @default 80
   */
  maxTitleLength?: number;

  /**
   * Fallback title the model should use when input is too sparse.
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
   * Additional instructions for the output format, appended to the prompt's output contract section.
   *
   * @default 'Return only the generated title as string, without any additional text or formatting.'
   */
  outputPrompt?: string | string[];
}

const DEFAULT_OPTIONS: Required<CreateScreenshotTitlePromptOptions> = {
  fallbackTitle: 'Should render correctly.',
  includeBrowserType: true,
  includeStoryId: false,
  maxTitleLength: 80,
  outputPrompt:
    'Return only the generated title as string, without any additional text or formatting.',
};

const INPUT_JSON_INDENT = 2;
const MIN_TITLE_LENGTH = 10;

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
    outputPrompt: outputPrompt,
  };
}

/**
 * Creates a strict prompt for LLMs to generate a screenshot title from Storybook data.
 *
 * The prompt enforces JSON-only output in the form:
 * `{"title":"..."}`.
 */
export function createScreenshotTitlePrompt(
  data: GenerateScreenshotTitleInput,
  options?: CreateScreenshotTitlePromptOptions,
): string {
  const resolved = normalizeOptions(options);
  const inputJson = JSON.stringify(data, null, INPUT_JSON_INDENT);

  return [
    'You are a screenshot title generator for Storybook Playwright.',
    'Your goal is to read the input JSON and produce one clear screenshot title.',
    '',
    'Follow this process internally before writing the final answer:',
    '1) Parse INPUT_JSON as JSON.',
    '2) Review every top-level and nested field and understand what each field says about the screenshot context.',
    '3) Decide the most important details for naming this screenshot.',
    '4) Build a short, human-friendly title.',
    '',
    'Field guide:',
    '- story.name: story display name.',
    '- story.title: Storybook group/title path.',
    '- story.changedArgs: args changed from defaults; high-priority signal for title.',
    '- story.initialArgs: default args for the story; use for context only.',
    '- story.argTypes: arg metadata; use only when it clarifies changedArgs.',
    '- story.parameters: Storybook-level metadata; only use if it impacts screenshot meaning.',
    '- story.filePath: source story file path.',
    '- story.id: unique Storybook story id.',
    '- browser.type: browser engine (chromium, firefox, webkit).',
    '- browser.options: browser/device options such as viewport and device profile.',
    '- screenshotOptions: screenshot behavior options that may change output meaning.',
    '',
    'Title rules:',
    `- Maximum length: ${resolved.maxTitleLength} characters.`,
    `- ${resolved.includeBrowserType ? 'Include browser type only when it adds useful context.' : 'Do not include browser type in the title.'}`,
    `- ${resolved.includeStoryId ? 'You may include story.id when needed for uniqueness.' : 'Do not include story.id unless no other unique context exists.'}`,
    '- Prefer changedArgs details when present.',
    '- Avoid filler words and generic phrases.',
    '- Title must be plain text (no markdown, no quotes around the full title).',
    '',
    'Output contract (strict):',
    ...resolved.outputPrompt,
    `- If context is insufficient, use fallback title: ${JSON.stringify(resolved.fallbackTitle)}`,
    '',
    'INPUT_JSON:',
    inputJson,
  ].join('\n');
}
