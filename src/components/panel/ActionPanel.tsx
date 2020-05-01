import React, { SFC, memo } from 'react';
import { API } from '@storybook/api';
import { ThemeProvider } from '../common';
import { ActionProvider } from '../../store';
import { ActionSets } from './action-set';

interface ActionPanelProps {
  api: API;
}

const ActionPanel: SFC<ActionPanelProps> = memo(() => {
  return (
    <ActionProvider>
      <ThemeProvider>
        <ActionSets />
      </ThemeProvider>
    </ActionProvider>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
