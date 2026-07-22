import { describe, expect, it } from 'vitest';
import {
  getAction,
  getExampleText,
  getGuideText,
  guideTopics,
  listActionsByCategory,
} from '../src/content.js';

describe('getGuideText', () => {
  it('returns overview + workflow + a topic index when no topic is given', () => {
    const { text, isError } = getGuideText();
    expect(isError).toBeUndefined();
    expect(text).toContain('storybook-addon-playwright');
    expect(text).toContain('More topics');
    // The index should reference other topics.
    expect(text).toContain('`conventions`');
  });

  it('returns a single guide for a known topic', () => {
    const { text } = getGuideText('conventions');
    expect(text).toContain('File naming');
    expect(text).toContain('.playwright.json');
  });

  it('concatenates everything for "all"', () => {
    const { text } = getGuideText('all');
    expect(text).toContain('File naming');
    expect(text).toContain('Generating the screenshots');
  });

  it('errors on an unknown topic', () => {
    const { text, isError } = getGuideText('nope');
    expect(isError).toBe(true);
    expect(text).toContain('Unknown topic');
  });

  it('exposes every guide id as a valid topic', () => {
    for (const topic of guideTopics) {
      expect(getGuideText(topic).isError).toBeUndefined();
    }
  });
});

describe('getAction', () => {
  it('returns a known action', () => {
    expect(getAction('takeElementScreenshot')?.category).toBe('screenshot');
  });

  it('returns undefined for an unknown action', () => {
    expect(getAction('nope')).toBeUndefined();
  });

  it('does not resolve inherited object properties', () => {
    expect(getAction('toString')).toBeUndefined();
    expect(getAction('constructor')).toBeUndefined();
  });
});

describe('listActionsByCategory', () => {
  it('groups actions and includes the screenshot category', () => {
    const grouped = listActionsByCategory();
    expect(grouped.screenshot).toContain('takeElementScreenshot');
    expect(grouped.interaction).toContain('click');
  });
});

describe('getExampleText', () => {
  it('returns a JSON example with the offset option and an explanation', () => {
    const text = getExampleText();
    expect(text).toContain('AlertToast.stories.playwright.json');
    expect(text).toContain('takeElementScreenshot');
    expect(text).toContain('offset');
    expect(text).toContain('components-alerttoast--default');
  });
});
