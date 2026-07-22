/**
 * A complete, realistic `*.stories.playwright.json` example returned by the
 * example tool. Modeled on real addon output (see AlertToast.stories.playwright.json):
 * click a trigger, wait for the async UI, then capture a focused element screenshot.
 */
export const exampleFileName = 'AlertToast.stories.playwright.json';

export const exampleFile = {
  version: '0',
  stories: {
    'components-alerttoast--default': {
      screenshots: [
        {
          id: 'uFlAH_zZFAzh',
          index: 0,
          title: 'Alert toast visible after clicking the button',
          browserType: 'chromium',
          browserOptionsId: 'zPuxu7-jRiLy',
          globals: { backgrounds: { grid: false } },
          actionSets: [
            {
              id: 'mY3U6QQbbhW3',
              title: 'click button',
              actions: [
                {
                  id: 'kp7myxehKDSV',
                  name: 'click',
                  args: { selector: '#alert-toast-button-1' },
                },
              ],
            },
            {
              id: 'CdvuIeSHQyVd',
              title: 'wait for toast',
              actions: [
                {
                  id: 'h3kf1ttnW62l',
                  name: 'waitForSelector',
                  args: {
                    selector: '[data-slot="alert"]',
                    options: { state: 'visible' },
                  },
                },
              ],
            },
            {
              id: '2yVRI1PpUOZi',
              title: 'takeElementScreenshot',
              actions: [
                {
                  id: 'b0q27HqRoDWr',
                  name: 'takeElementScreenshot',
                  args: {
                    selector: '[data-slot="alert"]',
                    options: { offset: 4 },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  browserOptions: {
    'zPuxu7-jRiLy': {
      viewport: { width: 811, height: 435 },
    },
  },
  screenshotOptions: {},
} as const;

export const exampleExplanation = `The file above (\`${exampleFileName}\`) sits next to \`AlertToast.stories.tsx\`.

- The story is keyed by its Storybook id \`components-alerttoast--default\`.
- \`actionSets\` run in order: click the trigger, wait for \`[data-slot="alert"]\`
  to become visible, then capture just that element with a 4px inward offset so
  the toast's outer margin/shadow is trimmed.
- \`browserOptionsId\` points into \`browserOptions\` to pin a deterministic viewport.
- Interactions and the screenshot both target stable \`#id\` / \`[data-slot]\` hooks.`;
