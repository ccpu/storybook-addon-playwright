import React, { memo } from 'react';
import { ActionSetMain } from '../action-set-panel';
import { CommonProvider } from '../common';
import { ActionProvider } from '../../store';

const ActionPanel: React.FC = memo(() => {
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
