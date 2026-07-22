import { describe, expect, it } from 'vitest';
import { actions } from '../src/data/actions.js';
import { DEFAULT_SEARCH_LIMIT, searchActions } from '../src/search.js';

describe('searchActions', () => {
  it('lists alphabetically for an empty query', () => {
    const results = searchActions(actions, '');
    const names = results.map((r) => r.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(results.length).toBeLessThanOrEqual(DEFAULT_SEARCH_LIMIT);
  });

  it('ranks an exact name match first', () => {
    const results = searchActions(actions, 'takeElementScreenshot');
    expect(results[0]?.name).toBe('takeElementScreenshot');
  });

  it('finds an action via keywords', () => {
    const results = searchActions(actions, 'crop');
    expect(results.map((r) => r.name)).toContain('takeElementScreenshot');
  });

  it('matches multi-word queries against description/keywords', () => {
    const results = searchActions(actions, 'wait for toast');
    expect(results.map((r) => r.name)).toContain('waitForSelector');
  });

  it('tolerates a small typo in the action name', () => {
    const results = searchActions(actions, 'hovr');
    expect(results.map((r) => r.name)).toContain('hover');
  });

  it('respects the limit', () => {
    expect(searchActions(actions, '', 3)).toHaveLength(3);
  });

  it('returns nothing for a nonsense query', () => {
    expect(searchActions(actions, 'zzzznotathing')).toHaveLength(0);
  });
});
