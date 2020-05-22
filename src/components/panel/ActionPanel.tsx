import React, { SFC, memo } from 'react';
import { ActionSetMain } from '../action-set';
import { ProviderWrapper } from './ProviderWrapper';

const ActionPanel: SFC = memo(() => {
  return <ProviderWrapper>{<ActionSetMain />}</ProviderWrapper>;
});

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
