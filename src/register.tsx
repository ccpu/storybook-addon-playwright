import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/manager-api';
import React from 'react';
import { ActionPanel, ScreenshotPanel } from './components/panel';
import { Preview } from './components/preview';
import { Tool } from './components/tool-bar';
import {
  ACTIONS_PANEL_ID,
  ADDON_ID,
  PREVIEW_ID,
  SCREENSHOT_PANEL_ID,
  TOAST_ID,
  TOOL_ID,
} from './constants';
import { Toaster } from 'sonner';

addons.add(PREVIEW_ID, {
  render: Preview as any,
  type: types.PREVIEW,
});

addons.register(ADDON_ID, () => {
  try {
    const parsedUrl = new URL(window.location.href);
    if (!parsedUrl.hostname) return;
  } catch {
    return;
  }

  // Toast must inject once at the manager level to ensure it is available in all panels and tools,
  // and not duplicated if multiple panels/tools use it.
  addons.add(TOAST_ID, {
    render: () => <Toaster position="bottom-left" />,
    title: 'toast',
    type: types.TAB,
  });

  addons.add(TOOL_ID, {
    render: () => <Tool />,
    title: 'snapshot',
    type: types.TOOL,
  });

  addons.add(ACTIONS_PANEL_ID, {
    render: ({ active }) => (
      <AddonPanel active={active ?? false}>
        <ActionPanel />
      </AddonPanel>
    ),
    title: 'Playwright Actions',
    type: types.PANEL,
  });

  addons.add(SCREENSHOT_PANEL_ID, {
    render: ({ active }) => (
      <AddonPanel active={active ?? false}>
        <ScreenshotPanel />
      </AddonPanel>
    ),
    title: 'Screenshots',
    type: types.PANEL,
  });
});
