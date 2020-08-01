import { setupPlaywright } from '../../.storybook/setup-playwright';
import { toMatchScreenshots } from '../../dist/to-match-screenshots';

expect.extend({ toMatchScreenshots });

describe('should pass', () => {
  beforeAll(async () => {
    await setupPlaywright();
  });

  it('should pass', async () => {
    await expect('../first.stories.playwright.json').toMatchScreenshots();
  });
});
