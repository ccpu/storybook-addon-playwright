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
    expect(prompt).toContain('Return exactly one object with exactly one key: title.');
    expect(prompt).toContain('{"title":"<generated title>"}');
    expect(prompt).toContain('"changedArgs": {');
    expect(prompt).toContain('"intent": "primary"');
    expect(prompt).toContain('Maximum length: 80 characters.');
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
});
