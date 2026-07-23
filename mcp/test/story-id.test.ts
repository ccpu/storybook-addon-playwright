import { describe, expect, it } from 'vitest';
import { getStoryId, sanitize, storyNameFromExport } from '../src/story-id.js';

describe('storyNameFromExport (word-splitting)', () => {
  it.each([
    ['WithActiveFilters', 'With Active Filters'],
    ['WithPrefix', 'With Prefix'],
    ['Default', 'Default'],
    ['OpenXLModal', 'Open XL Modal'],
    ['withHTMLParser', 'with HTML Parser'],
    ['Foo2Bar', 'Foo 2 Bar'],
    ['primary', 'primary'],
  ])('splits %s into %s', (input, expected) => {
    expect(storyNameFromExport(input)).toBe(expected);
  });
});

describe('sanitize', () => {
  it('lowercases and hyphenates', () => {
    expect(sanitize('Components/Jobs/JobFilterToolbar')).toBe(
      'components-jobs-jobfiltertoolbar',
    );
    expect(sanitize('With Active Filters')).toBe('with-active-filters');
    expect(sanitize('--Trim__Me--')).toBe('trim-me');
  });
});

describe('getStoryId', () => {
  it('produces the exact Storybook id (the reported bug case)', () => {
    expect(
      getStoryId('Components/Jobs/JobFilterToolbar', 'WithActiveFilters').storyId,
    ).toBe('components-jobs-jobfiltertoolbar--with-active-filters');
  });

  it('does NOT split the title on camelCase, only the story part', () => {
    const { titlePart, storyPart } = getStoryId(
      'Components/Jobs/JobFilterToolbar',
      'WithActiveFilters',
    );
    expect(titlePart).toBe('components-jobs-jobfiltertoolbar');
    expect(storyPart).toBe('with-active-filters');
  });

  it('handles single-word exports', () => {
    expect(getStoryId('Components/AlertToast', 'Default').storyId).toBe(
      'components-alerttoast--default',
    );
  });
});
