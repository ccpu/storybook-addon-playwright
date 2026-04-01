import React, { memo } from 'react';
import { ActionSetMain } from '../../features/action-set/components/action-set-panel/index';
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
