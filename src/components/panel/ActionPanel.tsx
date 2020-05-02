import React, { SFC, memo } from 'react';
import { API } from '@storybook/api';
import { ThemeProvider } from '../common';
import { ActionProvider } from '../../store';
import { ActionSets } from './action-set';
import { StateInspector } from 'reinspect';

interface ActionPanelProps {
  api: API;
}

const ActionPanel: SFC<ActionPanelProps> = memo(() => {
  return (
    <StateInspector>
      <ActionProvider>
        <ThemeProvider>
          <ActionSets />
        </ThemeProvider>
      </ActionProvider>
    </StateInspector>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
