import React, { memo } from 'react';
import { ActionSetMain } from '../../features/action-set/components/action-set-panel/index';
import { CommonProvider } from '../common';

const ActionPanel: React.FC = memo(() => {
  return (
    <CommonProvider>
      <ActionSetMain />
    </CommonProvider>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
