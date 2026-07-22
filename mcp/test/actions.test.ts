import { describe, expect, it } from 'vitest';
import { actions } from '../src/data/actions.js';

describe('action catalog integrity', () => {
  it('has unique action names', () => {
    const names = actions.map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('gives every action a non-empty description', () => {
    for (const action of actions) {
      expect(action.description.length).toBeGreaterThan(0);
    }
  });

  it('uses the action name in its own example object', () => {
    for (const action of actions) {
      if (action.example) {
        expect(action.example.name).toBe(action.name);
      }
    }
  });

  it('marks only screenshot-producing actions as capturing', () => {
    const capturing = actions.filter((a) => a.capturesScreenshot).map((a) => a.name);
    expect(capturing).toEqual(
      expect.arrayContaining([
        'takeElementScreenshot',
        'takeScreenshot',
        'takeScreenshotAll',
      ]),
    );
    // takeScreenshotOptions only configures merging; it must not be a capture.
    expect(capturing).not.toContain('takeScreenshotOptions');
  });

  it('documents the offset option on takeElementScreenshot', () => {
    const action = actions.find((a) => a.name === 'takeElementScreenshot');
    const argNames = action?.args?.map((arg) => arg.name) ?? [];
    expect(argNames).toContain('options.offset');
  });
});
