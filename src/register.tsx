import React from 'react';
import { addons, types } from '@storybook/manager-api';
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
// Register the PREVIEW wrapper at module load time (before React renders).
// In Storybook 8, initModules/loadAddons runs in a useEffect (after first render).
// The Canvas component captures `wrappers` as a closure on first render and never
// updates it, so we must populate elements[PREVIEW] before the first render.
// in version 10 may need to use definePreviewAddon instead of add with type PREVIEW (https://storybook.js.org/docs/addons/addon-migration-guide)
addons.add(PREVIEW_ID, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  addons.add(TOOL_ID, {
    render: () => <Tool />,
    title: 'snapshot',
    type: types.TOOL,
  });

  addons.add(ACTIONS_PANEL_ID, {
    render: ({ active }) => (
      <AddonPanel active={active}>
        <ActionPanel />
      </AddonPanel>
    ),
    title: 'Actions',
    type: types.PANEL,
  });

  addons.add(SCREENSHOT_PANEL_ID, {
    render: ({ active }) => (
      <AddonPanel active={active}>
        <ScreenshotPanel />
      </AddonPanel>
    ),
    title: 'Screenshots',
    type: types.PANEL,
  });
});
