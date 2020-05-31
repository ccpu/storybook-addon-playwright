import React, { SFC, memo } from 'react';
import { ActionSetMain } from '../action-set';
import { ProviderWrapper } from './ProviderWrapper';
import { ActionProvider } from '../../store';

const ActionPanel: SFC = memo(() => {
  return (
    <ProviderWrapper>
      <ActionProvider>
        <ActionSetMain />
      </ActionProvider>
    </ProviderWrapper>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
