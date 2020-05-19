import React, { SFC, memo } from 'react';
import { ActionSetMain } from '../action-set';
import { ProviderWrapper } from './ProviderWrapper';

interface ActionPanelProps {
  active: boolean;
}

const ActionPanel: SFC<ActionPanelProps> = memo(({ active }) => {
  if (!active) return null;
  return (
    <ProviderWrapper>
      <ActionSetMain />
    </ProviderWrapper>
  );
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
