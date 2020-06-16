# storybook-addons-playwright

storybook-addons-playwright is an Addon to visually test the storybook stories directly in the storybook environment..

> Note that this add-on meant to be used in development environment as it will interact with the file system.

> Addon will not work in storybook static build.

> This package has been tested with react component, therefore it may not work with other frameworks.

![addon-screenshot](assets/addon-screenshot.gif)

## Motivation

Being able to make components that feel and look same in all browser were always a challenge, it's required that developer keep switching between browsers and visually checking the components. It's also important to keep track of changes and be able to detect changes as quickly as possible. That's why this add-on has been created. With the help of playwright and storybook now it's possible to visually check components and notified of changes all in one place.

## Getting Started

Required packages:

- storybook-addons-playwright
- playwright-core
- @storybook/addon-knobs

```js
yarn add playwright playwright-core storybook-addons-playwright @storybook/addon-knobs --dev
```

The `playwright` package is not required if docker used to connect to the browsers.

## Configuration

within `.storybook/main.js`:

```js
import playwright from 'playwright';

(async () => {
  let browser = {
    chromium: await playwright['chromium'].launch(),
    firefox: await playwright['firefox'].launch(),
    webkit: await playwright['webkit'].launch(),
  };
  setConfig({
    storybookEndpoint: `http://localhost:9001/`,
    getPage: async (browserType, device) => {
      const context = await browser[browserType].newContext({ ...device });
      const page = await context.newPage();
      return page;
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
  });
})();

module.exports = {
  addons: [
    '@storybook/addon-knobs/register',
    'storybook-addons-playwright/register',
  ],
};
```

within .storybook/middleware.js:

```js
const middleware = require('storybook-addons-playwright/middleware');
module.exports = middleware;
```

## How it works

This add-on is basically an interface between playwright and storybook stories.
Add-on executes user instruction on the page provided in configuration file. It will save the user instruction in a json file saved next to the story file.

This add-on consist of there parts:

- Action panel
- Screenshots panel
- Screenshots preview

### Action list panel:

Action panel act like a playground, it consists of list of action sets that created by user for specific story and executes in the browser page when selected.

An action set can have single or multiple actions.

Actions are refer to playwright page methods such as click, mouse move etc...

### Screenshots list panel

This panel holds the screenshots taken previously, here you can manage screenshots such as delete edit or sort screenshots.

### Screenshot preview panel

The preview panel displays the latest screenshots taken by the playwright, it can selectively display all or some of the supported browser by playwright.

Here you can save and change the screenshots settings such as with, height etc...

The screenshots are saved in the folder named **screenshots** under story folder.

## Testing

### Jest

Screenshots saved with addon can be tested for change with test framework like jest. to do so configure the jest as follow:

add setup file to jest.config.js

```js
module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
};
```

within jest.setup.js

```js
import { toMatchScreenshots } from 'storybook-addons-playwright';

(async () => {
  let browser = {
    chromium: await playwright['chromium'].launch(),
    firefox: await playwright['firefox'].launch(),
    webkit: await playwright['webkit'].launch(),
  };
  setConfig({
    storybookEndpoint: `http://localhost:9001/`,
    getPage: async (browserType, device) => {
      const context = await browser[browserType].newContext({ ...device });
      const page = await context.newPage();
      return page;
    },
    afterScreenshot: async (page) => {
      await page.close();
    },
  });
})();
```
