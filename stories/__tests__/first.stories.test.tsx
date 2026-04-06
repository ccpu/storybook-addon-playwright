import { setupPlaywright } from '../../.storybook/setup-playwright';
import { toMatchScreenshots } from '../../dist/to-match-screenshots';

expect.extend({ toMatchScreenshots } as any);

//! to run uncomment testPathIgnorePatterns: ['./stories/*'] in jest.config.js

describe('should pass', () => {
  beforeAll(async () => {
    await setupPlaywright();
  });

  it('should pass', async () => {
    // eslint-disable-next-line vitest/valid-expect
    await // eslint-disable-next-line vitest/valid-expect
    (expect('../first.stories.playwright.json') as any).toMatchScreenshots();
  });
});
