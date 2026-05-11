# storybook-addon-playwright

An addon to visually test stories across multiple browsers within the Storybook environment.

> Addon will not work in a Storybook static build, but screenshots can be tested against static build files.

> This package has been tested with the React framework only and may not work with other frameworks.

> Works with [Component Story Format (CSF)](https://storybook.js.org/docs/formats/component-story-format/) only.

![addon-screenshot](https://raw.githubusercontent.com/ccpu/storybook-addon-playwright/master/assets/addon-screenshot.gif)

## Compatibility

| Package    | Version    |
| ---------- | ---------- |
| storybook  | ~8         |
| playwright | ~1.17      |
| Node.js    | >= 24.15.0 |

## Motivation

Being able to make components that feel and look the same in all browsers has always been a challenge. It requires developers to keep switching between browsers and visually checking components. It is also important to track changes and detect regressions as quickly as possible. With the help of Playwright and Storybook, this addon makes it possible to visually check components and be notified of changes — all in one place.

## Example

[storybook-addon-playwright-example](https://github.com/ccpu/storybook-addon-playwright-example)

## Getting Started

Install the package:

```bash
pnpm add -D storybook-addon-playwright
```

## Configuration

### 1. Register the addon

Within `.storybook/main.js` (or `main.ts`):

```js
module.exports = {
  stories: ['../**/*.stories.[tj]sx'],
  addons: ['storybook-addon-playwright/register'],
};
```

### 2. Configure the middleware

Within `.storybook/middleware.js`, initialise your Playwright browsers asynchronously, call `setConfig` immediately, and wait for readiness inside `getPage`. This keeps setup safe.

```js
const { setConfig } = require('storybook-addon-playwright/configs');
const addonMiddleware = require('storybook-addon-playwright/middleware');
const playwright = require('playwright');

const browsers = {};

// Initialise browsers asynchronously.
const ready = (async () => {
  browsers.chromium = await playwright.chromium.launch();
  browsers.firefox = await playwright.firefox.launch();
  browsers.webkit = await playwright.webkit.launch();
})();

setConfig({
  storybookEndpoint: 'http://localhost:6006/',
  getPage: async (browserType, options) => {
    await ready;
    return await browsers[browserType].newPage(options);
  },
  afterScreenshot: async (page) => {
    await page.close();
  },
});

module.exports = function (router) {
  addonMiddleware(router);
};
```

## setConfig Options

For a full list of available options with detailed descriptions, see the [`Config` interface in `src/typings/config.ts`](src/typings/config.ts).
Every option is documented with a JSDoc comment explaining its purpose, parameters, and usage.

## How it works

The addon is an interface between Playwright and Storybook stories. It executes user-defined action sequences on the Playwright page provided in the configuration.

Action sets are saved as JSON files next to the story file, so they persist across reloads.

The addon consists of three panels:

- **Action list panel**
- **Screenshots list panel**
- **Screenshots preview panel**

### Args

The addon stores Storybook controls state in `args` inside screenshot settings. When Playwright loads a story it rebuilds the `args` query string from this saved state.

> Older screenshot files that used a `knobs` field and stored in `props` are still read as a fallback. Use the [migration CLI](#migration) to upgrade them.

### Action list panel

The action panel acts as a playground. It holds the list of action sets created by the user for a specific story. Selecting an action set executes it on the Playwright page.

An action set can contain one or more actions. Actions correspond to Playwright `Page` methods such as `click`, `mouse.move`, etc.

### Screenshots list panel

This panel holds previously saved screenshots. From here you can delete, edit, or reorder screenshots.

### Screenshots preview panel

The preview panel shows the latest screenshots taken by Playwright. It can display screenshots from all supported browsers or a subset. You can save screenshots and change settings such as width and height.

Screenshots are stored in a folder named `__screenshots__` next to the story file.

## Add or extend Playwright page methods

Pass a `customActionSchema` object to `setConfig` to expose additional methods in the **Add Actions** menu of the Actions panel.

> This property follows [JSON Schema](http://json-schema.org/) rules with one additional property named `parameters`. A clear understanding of JSON Schema is required.

Example — add a coloured box to the page:

```js
const { setConfig } = require('storybook-addon-playwright/configs');
const addonMiddleware = require('storybook-addon-playwright/middleware');
const playwright = require('playwright');

async function addBox(position) {
  await this.evaluate((pos) => {
    if (!pos) return;
    const div = document.createElement('div');
    div.style.backgroundColor = '#009EEA';
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.position = 'absolute';
    div.style.top = pos.y + 'px';
    div.style.left = pos.x + 'px';
    document.body.append(div);
  }, position);
}

const browsers = {};
const ready = (async () => {
  browsers.chromium = await playwright.chromium.launch();
  browsers.firefox = await playwright.firefox.launch();
  browsers.webkit = await playwright.webkit.launch();
})();

setConfig({
  storybookEndpoint: 'http://localhost:6006/',
  getPage: async (browserType, options) => {
    await ready;
    const page = await browsers[browserType].newPage(options);
    page.addBox = addBox;
    return page;
  },
  afterScreenshot: async (page) => {
    await page.close();
  },
  customActionSchema: {
    addBox: {
      type: 'promise',
      parameters: {
        position: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
          required: ['x', 'y'],
        },
      },
    },
  },
});

module.exports = function (router) {
  addonMiddleware(router);
};
```

## Additional Page Methods

The following custom methods are automatically added to every Playwright page:

### Mouse & interaction

| Method                                                                   | Description                                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `clearInput(selector, options?)`                                         | Focuses the element matching `selector`, clears its value, and triggers an `input` event. |
| `mouseDownOnSelector(selector, point?, options?)`                        | Performs a `mousedown` at the center of the element matching `selector`.                  |
| `mouseMoveToSelector(selector, point?, options?)`                        | Moves the mouse to the center of the element matching `selector`.                         |
| `mouseFromTo(from, to, options?)`                                        | Performs a full mouse down → move → up sequence between two page positions.               |
| `dragDropSelector(selector, to, mouseDownRelativeToSelector?, options?)` | Grabs the element matching `selector` and drops it at the given position.                 |
| `setSelectorSize(selector, width?, height?)`                             | Sets the `width` and/or `height` of the element matching `selector`.                      |
| `scrollSelector(selector, scrollProperty)`                               | Sets `scrollLeft` and/or `scrollTop` on the element matching `selector`.                  |
| `selectorMouseWheel(selector, eventInitDict?)`                           | Dispatches a `WheelEvent` on the element matching `selector`.                             |

### Touch events

| Method                                                                                                | Description                                                                                        |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `touchStart(selector, page?, screen?, client?, options?)`                                             | Dispatches a `touchstart` event on the element matching `selector`.                                |
| `touchMove(selector, page?, screen?, client?, options?)`                                              | Dispatches a `touchmove` event on the element matching `selector`.                                 |
| `touchEnd(selector, page?, screen?, client?, options?)`                                               | Dispatches a `touchend` event on the element matching `selector`.                                  |
| `touchCancel(selector, page?, screen?, client?, options?)`                                            | Dispatches a `touchcancel` event on the element matching `selector`.                               |
| `touchFromTo(selector, pageFrom?, pageTo?, clientFrom?, clientTo?, screenFrom?, screenTo?, options?)` | Dispatches `touchstart` → `touchmove` → `touchend` in sequence on the element matching `selector`. |

### Screenshots

| Method                                                               | Description                                                                                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `takeScreenshot(stitchOptions?)`                                     | Takes a screenshot at the current point in an action sequence. All intermediate screenshots are merged with the final screenshot. |
| `takeScreenshotAll(stitchOptions?)`                                  | Takes a screenshot after every subsequent action. All screenshots are merged at the end.                                          |
| `takeElementScreenshot(selector)`                                    | Takes a screenshot cropped to the element matching `selector`.                                                                    |
| `takeScreenshotOptions(mergeType?, stitchOptions?, overlayOptions?)` | Sets global screenshot merge options for the current action set. Only one instance per action set is allowed.                     |

## Testing

Screenshots saved by the addon can be regression-tested in your test suite. The addon exports two primary helpers:

- **`toMatchScreenshots`** — a custom matcher that loads every `*.playwright.json` file and compares screenshots against saved baselines using `jest-image-snapshot`.
- **`runImageDiff`** — a standalone function that runs the same diff programmatically and returns results without a test framework matcher.
- **`getScreenshots`** — a lower-level helper that iterates screenshots and calls a callback with each buffer, for use with any assertion library.

### Setup with Vitest

Add a setup file to `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

Within `vitest.setup.ts`:

```ts
import playwright from 'playwright';
import { setConfig } from 'storybook-addon-playwright/configs';
import { toMatchScreenshots } from 'storybook-addon-playwright';

expect.extend({ toMatchScreenshots });

const browsers: Record<string, any> = {};

beforeAll(async () => {
  browsers.chromium = await playwright.chromium.launch();
  browsers.firefox = await playwright.firefox.launch();
  browsers.webkit = await playwright.webkit.launch();

  setConfig({
    storybookEndpoint: 'http://localhost:6006/', // or './storybook-static'
    getPage: async (browserType, options) => {
      return await browsers[browserType].newPage(options);
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
  });
});

afterAll(async () => {
  await Promise.all(Object.values(browsers).map((b) => b.close()));
});
```

### Setup with Jest

Add a setup file to `jest.config.js`:

```js
module.exports = {
  setupFilesAfterFramework: ['./jest.setup.js'],
};
```

Within `jest.setup.js`:

```js
const playwright = require('playwright');
const { setConfig } = require('storybook-addon-playwright/configs');
const { toMatchScreenshots } = require('storybook-addon-playwright');

expect.extend({ toMatchScreenshots });

let browsers = {};

beforeAll(async () => {
  browsers = {
    chromium: await playwright.chromium.launch(),
    firefox: await playwright.firefox.launch(),
    webkit: await playwright.webkit.launch(),
  };
  setConfig({
    storybookEndpoint: 'http://localhost:6006/', // or './storybook-static'
    getPage: async (browserType, options) => {
      return await browsers[browserType].newPage(options);
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
  });
});

afterAll(async () => {
  await Promise.all(Object.values(browsers).map((b) => b.close()));
});
```

### Using `toMatchScreenshots`

Pass `'*'` to test all `*.playwright.json` files found in the project, or pass a path relative to the test file to target a specific one:

```ts
describe('screenshot regression', () => {
  it('should match all saved screenshots', async () => {
    await expect('*').toMatchScreenshots();
  }, 60_000);

  it('should match a specific story file', async () => {
    await expect('Button.stories.playwright.json').toMatchScreenshots();
  }, 30_000);
});
```

> Set an appropriate timeout. Screenshot capture across multiple browsers can take tens of seconds.

### Using `runImageDiff`

Use `runImageDiff` when you want the diff results as a plain array rather than a matcher assertion:

```ts
import { runImageDiff } from 'storybook-addon-playwright';

const results = await runImageDiff('*');
const failures = results.filter((r) => !r.pass);
console.log(`${failures.length} screenshot(s) failed.`);
```

### Using `getScreenshots` with a custom assertion

```ts
import { getScreenshots } from 'storybook-addon-playwright';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('manual screenshot test', () => {
  it('should pass image diff', async () => {
    await getScreenshots({
      playwrightJsonPath: '*',
      requestId: 'my-run',
      onScreenshotReady: (screenshotBuffer, baselineScreenshotPath) => {
        expect(screenshotBuffer).toMatchImageSnapshot({
          customSnapshotIdentifier: baselineScreenshotPath.screenshotIdentifier,
          customSnapshotsDir: baselineScreenshotPath.screenshotsDir,
        });
      },
    });
  }, 60_000);
});
```

## TypeScript

The package ships `typings/global.d.ts` which augments Vitest's `Assertion` interface with `toMatchScreenshots` and `toMatchImageSnapshot`. Reference it in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "storybook-addon-playwright/typings/global"]
  }
}
```

Or add a triple-slash reference in any `.d.ts` file in your project:

```ts
/// <reference types="storybook-addon-playwright/typings/global" />
```

## Migration

Run migration from the CLI to upgrade older screenshot files from the deprecated `props` field to `args`:

```bash
npx storybook-addon-playwright migrate props-to-args
```

This command scans all `*.playwright.json` files and migrates screenshot settings from `props` to `args`.
When `args` already exists it is kept as-is and only `props` is removed.
