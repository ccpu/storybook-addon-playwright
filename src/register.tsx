import React from 'react';
import addons, { types } from '@storybook/addons';
import {
  ADDON_ID,
  ACTIONS_PANEL_ID,
  TOOL_ID,
  PREVIEW_ID,
  SCREENSHOT_PANEL_ID,
} from './constants';
import { Tool } from './components/tool-bar';
import { ActionPanel, ScreenshotPanel } from './components/panel';
import { AddonPanel } from '@storybook/components';
import { Preview } from './components/preview';

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    render: () => <Tool />,
    title: 'snapshot',
    type: types.TOOL,
  });

  addons.add(ACTIONS_PANEL_ID, {
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <ActionPanel active={active} />
      </AddonPanel>
    ),
    title: 'Screenshot Actions',
    type: types.PANEL,
  });

  addons.add(SCREENSHOT_PANEL_ID, {
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <ScreenshotPanel active={active} />
      </AddonPanel>
    ),
    title: 'Screenshots',
    type: types.PANEL,
  });

  addons.add(PREVIEW_ID, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: Preview as any,
    title: 'Screenshot Actions',
    type: types.PREVIEW,
  });
});
