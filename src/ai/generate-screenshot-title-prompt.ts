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
    'Return only the generated title as string, without any additional text or formatting.',
};

const INPUT_JSON_INDENT = 2;
const MIN_TITLE_LENGTH = 10;

const storyGuide = {
  changedArgs:
    'The specific arguments that have been changed from their default values for this story; these are high-priority signals for understanding what is unique about this screenshot.',
  initialArgs:
    'The default arguments for the story, which can provide context but are less important than changedArgs for title generation.',
  argTypes:
    'Metadata about the story arguments, which should only be used if it clarifies the meaning of changedArgs.',
  name: 'The display name of the story, often concise and descriptive.',
  title:
    'The hierarchical path of the story in Storybook, which may include groupings and can provide context about the component and its variations.',
  parameters:
    'Additional metadata at the Storybook level, which should only be considered if it impacts the meaning of the screenshot.',
  filePath:
    'The file path to the source story, which may provide context about the component or feature being tested.',
  id: 'The unique identifier for the Storybook story, which should only be included in the title if no other unique context exists.',
} satisfies ScreenshotTitleFieldGuide['story'];

const browserGuide = {
  type: 'The type of browser engine used (e.g., chromium, firefox, webkit), which should be included in the title only when it adds useful context.',
  options:
    'Options related to the browser or device, such as viewport size and device profile, which may influence the meaning of the screenshot.',
} satisfies ScreenshotTitleFieldGuide['browser'];

const screenshotOptionsGuide =
  'Behavior options for taking the screenshot that may change its meaning or context.';

const fieldGuide: ScreenshotTitleFieldGuide = {
  story: storyGuide,
  browser: browserGuide,
  screenshotOptions: screenshotOptionsGuide,
};

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
    'Follow this process internally before writing the final answer:',
    '1) Parse INPUT_JSON as JSON.',
    '2) Review every top-level and nested field and understand what each field says about the screenshot context.',
    '3) Decide the most important details for naming this screenshot.',
    '4) Build a short, human-friendly title.',
    '',
    ...fieldGuideSections,
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
