import React, { SFC, memo } from 'react';
import { ActionSetMain } from '../action-set';
import { CommonProvider } from '../common';
import { ActionProvider } from '../../store';

const ActionPanel: SFC = memo(() => {
  return (
    <CommonProvider>
      <ActionProvider>
        <ActionSetMain />
      </ActionProvider>
    </CommonProvider>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
