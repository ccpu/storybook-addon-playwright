import { createScreenshotTitlePrompt } from '../../src/ai/generate-screenshot-title-prompt';

const input = {
  browser: {
    options: {
      viewport: {
        height: 900,
        width: 1440,
      },
    },
    type: 'chromium',
  },
  screenshotOptions: {
    fullPage: true,
  },
  story: {
    changedArgs: {
      intent: 'primary',
      loading: true,
    },
    filePath: 'stories/Button.stories.tsx',
    id: 'forms-button--primary-loading',
    name: 'Primary Loading',
    title: 'Forms/Button',
  },
} as const;

describe('createScreenshotTitlePrompt', () => {
  it('builds a strict prompt with input JSON and output contract', () => {
    const prompt = createScreenshotTitlePrompt(input);

    expect(prompt).toContain('Parse INPUT_JSON as JSON.');
    expect(prompt).toContain(
      'Return only the generated title as string, without any additional text or formatting.',
    );
    expect(prompt).toContain('"changedArgs": {');
    expect(prompt).toContain('"intent": "primary"');
    expect(prompt).toContain('Maximum length: 80 characters.');
    expect(prompt).toContain('Output contract (strict):');
  });

  it('applies provided options to prompt instructions', () => {
    const prompt = createScreenshotTitlePrompt(input, {
      fallbackTitle: 'Fallback from AI',
      includeBrowserType: false,
      includeStoryId: true,
      maxTitleLength: 64,
    });

    expect(prompt).toContain('Maximum length: 64 characters.');
    expect(prompt).toContain('Do not include browser type in the title.');
    expect(prompt).toContain('You may include story.id when needed for uniqueness.');
    expect(prompt).toContain('fallback title: "Fallback from AI"');
  });

  it('normalizes invalid values to safe defaults', () => {
    const prompt = createScreenshotTitlePrompt(input, {
      fallbackTitle: '   ',
      maxTitleLength: 1,
    });

    expect(prompt).toContain('Maximum length: 10 characters.');
    expect(prompt).toContain('fallback title: "Should render correctly."');
  });

  it('supports a custom outputPrompt string', () => {
    const prompt = createScreenshotTitlePrompt(input, {
      outputPrompt: 'Return a single sentence with no punctuation.',
    });

    expect(prompt).toContain('Output contract (strict):');
    expect(prompt).toContain('- Return a single sentence with no punctuation.');
    expect(prompt).not.toContain(
      'Return only the generated title as string, without any additional text or formatting.',
    );
  });

  it('supports multiple outputPrompt instructions', () => {
    const prompt = createScreenshotTitlePrompt(input, {
      outputPrompt: ['Return only the title.', 'Do not include quotes or markdown.'],
    });

    expect(prompt).toContain('- Return only the title.');
    expect(prompt).toContain('- Do not include quotes or markdown.');
  });

  it('omits field guide sections when input data is missing', () => {
    const prompt = createScreenshotTitlePrompt({
      story: {
        filePath: 'stories/Button.stories.tsx',
        id: 'forms-button--primary-loading',
        name: 'Primary Loading',
        title: 'Forms/Button',
      },
    });

    expect(prompt).toContain('Field guide:');
    expect(prompt).toContain('- story.name:');
    expect(prompt).not.toContain('- browser.type:');
    expect(prompt).not.toContain('- screenshotOptions:');
  });
});
