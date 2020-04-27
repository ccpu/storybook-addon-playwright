import React from 'react';
import addons, { types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, TOOL_ID, PREVIEW_ID } from './constants';
import { Tool } from './components/tool-bar';
import { DemoPanel } from './components/panel';
import { AddonPanel } from '@storybook/components';
import { Preview } from './components/preview';

addons.register(ADDON_ID, (api) => {
  addons.add(TOOL_ID, {
    render: () => <Tool />,
    title: 'snapshot',
    type: types.TOOL,
  });

  addons.add(PANEL_ID, {
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <DemoPanel api={api} />
      </AddonPanel>
    ),
    title: 'Addon panel',
    type: types.PANEL,
  });

  addons.add(PREVIEW_ID, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: Preview as any,
    title: 'Addon Preview',
    type: types.PREVIEW,
  });
});
